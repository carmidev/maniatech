import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Cliente Supabase con Service Role Key para saltar políticas RLS en el servidor
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  // ── REGLA DE META: Siempre responder 200 OK de inmediato ──────────────────
  // Procesamos en background para no bloquear la respuesta.

  try {
    const body = await req.json();

    // Extraer el número de teléfono del cliente según la estructura de WhatsApp Cloud API
    const phone: string | undefined =
      body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from;

    if (!phone) {
      // El webhook puede recibir eventos sin mensajes (ej: status updates).
      // No es un error, simplemente no hay nada que guardar.
      console.log('[webhook] Evento recibido sin campo "from". Ignorando.');
      return NextResponse.json({ status: 'ignored' }, { status: 200 });
    }

    const now = new Date().toISOString();

    // Upsert: si el cliente ya existe (por teléfono) actualiza last_wa_interaction,
    // si no existe, lo crea con ese número y el timestamp.
    const { error } = await supabase
      .from('customers')
      .upsert(
        { phone, last_wa_interaction: now },
        { onConflict: 'phone' }   // columna única que actúa como clave de deduplicación
      );

    if (error) {
      // Logueamos el error pero NO retornamos 500 — Meta reintentaría el webhook.
      console.error('[webhook] Error al actualizar Supabase:', error.message);
    } else {
      console.log(`[webhook] last_wa_interaction actualizado para: ${phone}`);
    }
  } catch (err) {
    // JSON malformado u otro error inesperado en la estructura del payload
    console.error('[webhook] Error al procesar el payload:', err);
  }

  // Siempre 200 OK — obligatorio por las políticas de Meta/WhatsApp Cloud API
  return NextResponse.json({ status: 'ok' }, { status: 200 });
}

// Verificación del webhook (GET) — Meta lo usa para confirmar el endpoint al activarlo
// https://developers.facebook.com/docs/graph-api/webhooks/getting-started
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const mode      = searchParams.get('hub.mode');
  const token     = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('[webhook] Verificación exitosa de Meta.');
    // Devolvemos el challenge como texto plano — requisito de Meta
    return new Response(challenge, { status: 200 });
  }

  console.warn('[webhook] Intento de verificación fallido. Token inválido.');
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
