# Vercel Deployment Rules (ManiaTech & CarMiDev)

- **Vercel Hobby Teams & Repositorios Privados**: En equipos de Vercel (Hobby plan) con repositorios privados de GitHub, hacer clic en `Redeploy` **NO** funciona para saltar el bloqueo de colaboración. Vercel re-evalúa los permisos del autor en cada build y mantiene el estado `Blocked`.
- **Soluciones Válidas**:
  1. Cambiar la visibilidad del repositorio en GitHub a **Público** (como `tributocafe`).
  2. Importar/desplegar el proyecto dentro del espacio **Personal** del propietario en Vercel en lugar del espacio de **Equipo**.
  3. NUNCA sugerir `Redeploy` como bypass de licencias Pro en Vercel Hobby Teams.

# Protocolo Estricto de Git (CarMiDev HQ)
- **PROHIBIDO AUTÓNOMAMENTE**: NUNCA ejecutar `git commit` ni `git push` a menos que Migue lo ordene o autorice explícitamente en el chat.

# Reglas de Navegación & Scroll en Presupuesto Deck (`/presupuesto`)
- **Aislamiento de Diapositiva 2 (Tabla Detallada)**: La rueda del mouse (wheel scroll) en la Diapositiva 1 (Opciones de Contratación) DEBE saltar directamente a la Diapositiva 3 (Costos Operativos). La Diapositiva 2 SOLO se abre al pulsar explícitamente "Ver Detalles & Entregables".
- **Bloqueo Total de Scroll en Diapositiva 2**: Mientras el usuario esté en la Diapositiva 2, la rueda del mouse NO cambia de diapositiva jamás (uso de `e.stopPropagation()` e `if (currentSlide === 2) return;`). Salir de la Diapositiva 2 exige pulsar `← Volver a los Planes` o `Costos Operativos →`.
- **Aislamiento de Widgets de E-Commerce**: Páginas comerciales independientes de CarMiDev HQ (`/presupuesto`) NO deben heredar el widget flotante de WhatsApp del e-commerce.
- **Copy Comercial Inmutable de CarMiDev HQ**: NUNCA alterar el copy predeterminado (títulos, taglines, resúmenes, descripciones de entregables) ni los mensajes de WhatsApp (que SIEMPRE deben comenzar exactamente con `¡Hola CarMiDev!`).
