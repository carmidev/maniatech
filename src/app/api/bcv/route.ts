import { NextResponse } from 'next/server';

// Memoria caché simple en el servidor (persiste mientras la función serverless esté activa)
let cachedRate: number | null = null;
let lastFetched: Date | null = null;

// Función para calcular el TTL óptimo basado en el horario bancario venezolano
function getTTLInMinutes() {
  const now = new Date();
  
  // Convertir hora actual a Hora de Venezuela (UTC-4)
  const vzlaTime = new Date(now.getTime() - (4 * 60 * 60 * 1000));
  const day = vzlaTime.getUTCDay(); // 0 = Domingo, 1 = Lunes...
  const hours = vzlaTime.getUTCHours();

  // Fin de semana: Viernes desde las 4pm hasta Lunes a las 8am
  const isWeekend = day === 0 || day === 6 || (day === 5 && hours >= 16) || (day === 1 && hours < 8);
  if (isWeekend) {
    return 24 * 60; // 24 horas (Consultar una vez al día)
  }

  // Ventana Activa: Lunes a Viernes 9am-11am y 1pm-3pm
  const isActiveWindow = (hours >= 9 && hours < 11) || (hours >= 13 && hours < 15);
  if (isActiveWindow) {
    return 15; // 15 minutos (Actualización rápida)
  }

  // Modo Crucero: Resto de la semana (noches, madrugadas, mediodía)
  return 6 * 60; // 6 horas
}

export async function GET() {
  const now = new Date();
  
  // Verificar si la caché sigue siendo válida
  if (cachedRate && lastFetched) {
    const ttlMinutes = getTTLInMinutes();
    const diffMinutes = (now.getTime() - lastFetched.getTime()) / (1000 * 60);
    
    if (diffMinutes < ttlMinutes) {
      return NextResponse.json({ 
        rate: cachedRate, 
        source: 'cache',
        ttl_minutes_applied: ttlMinutes 
      });
    }
  }

  // Si no hay caché o expiró, consultar la API (DolarAPI Venezuela como proveedor confiable)
  try {
    const response = await fetch('https://ve.dolarapi.com/v1/euros/oficial', {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store' // Evitar caché duro de Next.js
    });
    
    if (!response.ok) throw new Error(`API respondió con estatus: ${response.status}`);
    
    const data = await response.json();
    
    // Buscar el valor "promedio" (tasa oficial BCV)
    if (data && data.promedio) {
      cachedRate = parseFloat(data.promedio);
      lastFetched = now;
      return NextResponse.json({ 
        rate: cachedRate, 
        source: 'api',
        ttl_minutes_applied: getTTLInMinutes() 
      });
    } else {
      throw new Error('No se encontró el campo promedio en la respuesta');
    }
  } catch (error) {
    console.error("Error consultando tasa BCV:", error);
    
    // Fallback: Si la API falla, devolver la última caché conocida o un valor por defecto seguro
    return NextResponse.json({ 
      rate: cachedRate || 36.50, // Sustituir por tu tasa por defecto en caso de emergencia extrema
      source: 'fallback',
      error: 'La API externa falló' 
    });
  }
}
