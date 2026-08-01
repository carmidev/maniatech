# Plantilla Base E-Commerce (ManiaTech)

Esta es una plantilla lista para producción inspirada en la arquitectura frontend, componentes, carrito, catálogo interactivo, checkout de 4 pasos y flujo de pagos de DolceCandy. Diseñada como base agnóstica para acelerar el desarrollo de múltiples proyectos de comercio electrónico.

---

## 🚀 Características Incluidas

- **Páginas Frontend Completas**: Home, Catálogo Interactivo con filtros de categoría, Carrito Masticable/Drawer, Modal de Auth y Checkout de 4 Pasos.
- **Flujo de Pago y Selección de Entrega**: Integrado para Pago Móvil, Transferencias, Zelle, Efectivo y opciones de Delivery, Retiro en Tienda o Envío Nacional (MRW, Zoom, Tealca, Domesa).
- **Modo Plantilla Resiliente (Offline / Mock Data)**: Funciona al 100% sin necesidad de tener una base de datos conectada en desarrollo. Si Supabase no está configurado, la aplicación commuta automáticamente a datos de prueba (*Mock Data*).
- **Styling y Microinteracciones**: Tailwind CSS con sistema de tokens, Google Fonts y `framer-motion` para animaciones ultra fluidas.

---

## 🛠️ Instalación y Desarrollo Local

1. **Clonar este repositorio**:
   ```bash
   git clone <URL_DE_TU_REPOSITORIO> mi-nuevo-ecommerce
   cd mi-nuevo-ecommerce
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```

---

## 📖 GUÍA TÉCNICA: Cómo Conectar la Base de Datos (Supabase)

Esta sección contiene las instrucciones paso a paso para cuando desees vincular una base de datos real en un proyecto derivado.

### Paso 1: Configurar las Variables de Entorno

Copia el archivo `.env.local.example` a `.env.local` y rellena las claves de tu proyecto de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui

# Tarifas opcionales de checkout
NEXT_PUBLIC_DELIVERY_COST=3
NEXT_PUBLIC_BAG_FEE=1
```

---

### Paso 2: Crear las Tablas Requeridas en la Base de Datos

Para que la aplicación interactúe con el backend en tiempo real, crea el siguiente esquema relacional en tu proyecto de Supabase:

#### 1. Tabla `products`
```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  owner_review TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  category TEXT[] DEFAULT '{}',
  is_archived BOOLEAN DEFAULT false,
  sku TEXT,
  flavor TEXT,
  variant TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### 2. Tabla `inventory`
```sql
CREATE TABLE inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  location_id TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 0
);
```

#### 3. Tabla `orders`
```sql
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  items JSONB NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  delivery_method TEXT NOT NULL,
  delivery_address TEXT,
  pickup_store TEXT,
  payment_method TEXT NOT NULL,
  payment_holder TEXT,
  payment_reference TEXT,
  payment_cash_amount NUMERIC(10,2),
  payment_receipt_url TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### 4. Tabla `customers`
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  phone TEXT UNIQUE,
  id_number TEXT,
  gender TEXT,
  email TEXT UNIQUE,
  auth_provider TEXT,
  last_wa_interaction TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### 5. Tabla `store_settings`
```sql
CREATE TABLE store_settings (
  id TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insertar tasa BCV inicial por defecto
INSERT INTO store_settings (id, value) VALUES ('exchange_rate', '36.50');
```

#### 6. Tabla `addresses` (Opcional para delivery guardado)
```sql
CREATE TABLE addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  formatted_address TEXT NOT NULL,
  unit TEXT,
  reference_point TEXT,
  lat NUMERIC(10,7),
  lng NUMERIC(10,7),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

### Paso 3: Configurar Storage Bucket para Comprobantes de Pago

1. Ve a **Storage** en tu panel de Supabase.
2. Crea un bucket **público** llamado `payment_receipts`.
3. Aplica políticas RLS para permitir lecturas públicas e inserciones autenticadas/anon:
```sql
CREATE POLICY "Permitir subida publica de comprobantes" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'payment_receipts');
```

---

### Paso 4: Configurar Autenticación por Correo (OTP) y Google OAuth

1. **Servidor SMTP para Códigos OTP**:
   - En tu panel de Supabase: Ve a **Authentication** -> **Providers** -> **Email**.
   - Habilita la opción **Enable Email Provider** y activa **Confirm email**.
   - Para evitar límites de envío (Rate Limit), configura tus credenciales SMTP personalizadas (vía Resend, SendGrid o SMTP corporativo) en **Authentication** -> **SMTP Settings**.

2. **Google OAuth**:
   - En Supabase: Ve a **Authentication** -> **Providers** -> **Google**.
   - Ingresa el **Client ID** y **Client Secret** generados desde la Google Cloud Console.
   - Agrega `${window.location.origin}/auth/callback` a las **Authorized redirect URIs**.

---

### Paso 6: Configurar Google Maps JavaScript API y Places API

1. **Crear API Key en Google Cloud**:
   - Ve a [Google Cloud Console](https.console.cloud.google.com).
   - Crea un nuevo proyecto y activa las siguientes APIs:
     - **Maps JavaScript API**
     - **Places API**
     - **Geocoding API**
2. **Configuración de Variable de Entorno**:
   - En `.env.local` agrega tu llave:
     ```env
     NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_real_aqui
     ```
3. **Restricción de Dominio**:
   - En la consola de Google Cloud, aplica una restricción de **HTTP Referrers** a tu API Key agregando tus dominios de producción y local (`http://localhost:3000/*`, `https://tu-dominio.com/*`).

---

### Paso 7: Lista de Archivos Clave del Código a Revisar

Al conectar la BD, los siguientes módulos pasarán automáticamente de modo *Mock* a consultar la BD en vivo:

- `src/lib/supabase.ts`: Inicialización del cliente cliente público.
- `src/app/catalogo/actions.ts`: Consulta de lista de productos con inventario.
- `src/app/checkout/actions.ts`: Validación de precios del servidor, creación de orden e inserción en tabla `orders` y deducción de stock en `inventory`.
- `src/app/api/webhook/route.ts`: Endpoint de recepción para notificaciones de WhatsApp/Meta.
- `src/context/AuthContext.tsx`: Gestión de sesión y autenticación OAuth/Google.
- `src/components/ProfileForm.tsx`: Registro y actualización de perfil en la tabla `customers`.

---

## 📂 Estructura del Código

```
src/
├── app/               # Rutas principales (Home, Catálogo, Checkout, Callback Auth)
├── components/        # Componentes UI (Navbar, Footer, Modales, Cards, ProfileForm)
├── context/           # Contextos globales (CartContext, AuthContext)
├── lib/               # Clientes API (supabase.ts)
└── utils/             # Helpers de formato de imagen y moneda
```
