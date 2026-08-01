import { getProductsWithInventory } from './actions';
import { Candy } from "@/app/mock-data";
import { CatalogoClient } from "./CatalogoClient";

export const metadata = {
  title: "Catálogo Hardware & Gaming | Mania Tech",
  description: "Explora nuestro catálogo completo de audífonos, mouses, teclados mecánicos, micrófonos, cámaras de streaming y almacenamiento SSD con garantía oficial en Venezuela.",
};

export const revalidate = 5;

// Mocks por defecto si la base de datos no retorna items
const MOCK_HARDWARE: Candy[] = [
  {
    id: "tech-1",
    name: "Audífonos Redragon Zeus H510 RGB Wireless",
    category: "audifonos",
    price: 59.99,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"],
    badge: "top",
    stock: 12,
    description: "Sonido envolvente 7.1 surround, almohadillas de memoria con cancelación pasiva de ruido y micrófono omnidireccional extraíble.",
    ownerReview: "",
    flavor: "Redragon",
    variant: "Wireless"
  },
  {
    id: "tech-2",
    name: "Mouse Gamer Logitech G502 X LIGHTSPEED",
    category: "mouses",
    price: 119.99,
    images: ["https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80"],
    badge: "bestseller",
    stock: 8,
    description: "Switches híbridos óptico-mecánicos LIGHTFORCE, sensor HERO 25K de máxima precisión y botón DPI ajustable.",
    ownerReview: "",
    flavor: "Logitech G",
    variant: "Inalámbrico"
  },
  {
    id: "tech-3",
    name: "Teclado Mecánico Redragon Kumara K552 RGB 60%",
    category: "teclados",
    price: 45.00,
    images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80"],
    badge: "viral",
    stock: 15,
    description: "Switches Outemu Red de rápida respuesta, chasis de aluminio reforzado e iluminación RGB por tecla totalmente personalizable.",
    ownerReview: "",
    flavor: "Redragon",
    variant: "Alámbrico"
  },
  {
    id: "tech-4",
    name: "Micrófono de Condensador Maono AU-A04 USB Kit",
    category: "microfonos",
    price: 49.99,
    images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80"],
    badge: "nuevo",
    stock: 6,
    description: "Incluye brazo articulado de metal, filtro anti-pop y araña shock mount. Tasa de muestreo profesional 192kHz/24bit.",
    ownerReview: "",
    flavor: "Maono",
    variant: "USB"
  },
  {
    id: "tech-5",
    name: "Control Inalámbrico Sony PS5 DualSense Edge Pro",
    category: "controles",
    price: 199.99,
    images: ["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&auto=format&fit=crop&q=80"],
    badge: "exclusivo",
    stock: 5,
    description: "Gatillos adaptativos personalizables, palancas traseras mapeables y perfiles de juego intercambiables al instante.",
    ownerReview: "",
    flavor: "Sony",
    variant: "Pro"
  },
  {
    id: "tech-6",
    name: "Disco Sólido SSD NVMe M.2 2TB Kingston FURY Renegade",
    category: "almacenamiento",
    price: 145.00,
    images: ["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80"],
    badge: "top",
    stock: 10,
    description: "Velocidad de lectura extrema hasta 7,300MB/s con disipador térmico de aluminio. Compatible con PC Gaming y PS5.",
    ownerReview: "",
    flavor: "Kingston",
    variant: "NVMe 2TB"
  },
  {
    id: "tech-7",
    name: "Cámara Web Elgato Facecam Pro 4K60",
    category: "streaming",
    price: 249.99,
    images: ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80"],
    badge: "nuevo",
    stock: 4,
    description: "Sensor Sony STARVIS de grado fotográfico profesional, enfoque automático avanzado y lente Elgato Prime Lens f/2.0.",
    ownerReview: "",
    flavor: "Elgato",
    variant: "4K"
  },
  {
    id: "tech-8",
    name: "Sistema de Micrófono Inalámbrico Hollyland Lark M1 Duo",
    category: "microfonos",
    price: 129.99,
    images: ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80"],
    badge: "bestseller",
    stock: 9,
    description: "Cancelación de ruido HearClear con un solo clic, alcance hasta 200m y estuche de carga portátil compacto.",
    ownerReview: "",
    flavor: "Hollyland",
    variant: "Inalámbrico"
  },
  {
    id: "tech-9",
    name: "Mousepad XXL RGB Fantech Agility MP903 Pro",
    category: "mouses",
    price: 28.00,
    images: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"],
    badge: "nuevo",
    stock: 20,
    description: "Superficie de tela micro-texturizada impermeabilizada de 900x400mm con costuras anti-desgaste y bordes RGB brillantes.",
    ownerReview: "",
    flavor: "Fantech",
    variant: "XXL RGB"
  }
];

export default async function CatalogoPage() {
  let mappedProducts: Candy[] = [];
  
  try {
    const result = await getProductsWithInventory();

    if (result && result.success && result.data && result.data.length > 0) {
      mappedProducts = result.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description || "",
        ownerReview: item.owner_review || "",
        price: Number(item.price) || 0,
        images: item.images && item.images.length > 0 
          ? item.images 
          : [MOCK_HARDWARE[0].images[0]],
        category: item.category || "audifonos",
        stock: item.inventory?.reduce((sum: number, loc: any) => sum + (loc.quantity || 0), 0) || 10,
        sku: item.sku,
        flavor: item.brand || item.flavor || "Mania Tech",
        variant: item.variant,
      }));
    } else {
      mappedProducts = MOCK_HARDWARE;
    }
  } catch {
    mappedProducts = MOCK_HARDWARE;
  }

  return <CatalogoClient initialProducts={mappedProducts} />;
}
