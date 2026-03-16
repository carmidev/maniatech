export interface Candy {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "chocolates" | "gomitas" | "acidos" | "pikantes" | "virales" | "bebidas" | "especiales";
  tag?: string;
  badge?: "nuevo" | "bestseller" | "viral" | "exclusivo";
}

export const CANDIES: Candy[] = [
  {
    id: "1",
    name: "Lindt Dubai Pistachio",
    description: "El chocolate viral de Instagram. Relleno cremoso de pistacho y un toque crujiente de kunafa. Edición Limitada.",
    price: 15.00,
    image: "/images/catalog/dubai-choc.jpg",
    category: "virales",
    badge: "viral",
  },
  {
    id: "2",
    name: "Pulparindo Original",
    description: "El clásico pulparindo de tamarindo natural con sal y chile. Un balance perfecto entre ácido y picante.",
    price: 1.50,
    image: "/images/catalog/pulparindo.jpg",
    category: "pikantes",
  },
  {
    id: "3",
    name: "Skittles Giants Sour",
    description: "Versión gigante y extra ácida. Para los que buscan emociones fuertes en cada mordida.",
    price: 3.50,
    image: "/images/catalog/skittles-sour.jpg",
    category: "acidos",
  },
  {
    id: "4",
    name: "Feastables Milk Chocolate",
    description: "El chocolate de MrBeast. Sabor ultra cremoso con solo 5 ingredientes de alta calidad.",
    price: 6.00,
    image: "/images/catalog/feastables.jpg",
    category: "virales",
    badge: "nuevo",
  },
  {
    id: "5",
    name: "Nerds Gummy Clusters",
    description: "Gominolas masticables recubiertas de Nerds crujientes. Explosión de sabor en cada bocado.",
    price: 5.50,
    image: "/images/catalog/nerds-clusters.jpg",
    category: "gomitas",
    badge: "bestseller",
  },
  {
    id: "6",
    name: "Reese's Peanut Butter Jars",
    description: "Cremosa mantequilla de maní con el chocolate clásico de Reese's en formato para compartir.",
    price: 4.50,
    image: "/images/catalog/reeses.jpg",
    category: "chocolates",
    badge: "exclusivo",
  },
  {
    id: "7",
    name: "Sour Patch Kids Hearts",
    description: "Edición especial de corazones. Primero ácidos, luego dulces. Perfectos para San Valentín.",
    price: 4.00,
    image: "/images/catalog/sour-hearts.jpg",
    category: "acidos",
    badge: "nuevo",
  },
  {
    id: "8",
    name: "Lucas Muecas Pepino",
    description: "Caramelo con polvo de chile sabor pepino. Tradición mexicana pura y divertida.",
    price: 2.00,
    image: "/images/catalog/lucas.jpg",
    category: "pikantes",
  },
  {
    id: "9",
    name: "M&Ms Peanut Share Size",
    description: "El clásico maní tostado recubierto de chocolate y una capa crujiente de colores.",
    price: 3.00,
    image: "/images/catalog/mms.jpg",
    category: "chocolates",
    badge: "bestseller",
  },
  {
    id: "10",
    name: "Jolly Rancher Chewy Poppers",
    description: "Caramelos masticables con un centro líquido explosivo. Sabores frutales intensos.",
    price: 4.80,
    image: "/images/catalog/jolly.jpg",
    category: "gomitas",
  },
  {
    id: "11",
    name: "Warheads Cubes Sour",
    description: "Cubos masticables recubiertos de polvo extra ácido. Solo para valientes.",
    price: 4.20,
    image: "/images/catalog/warheads.jpg",
    category: "acidos",
  },
  {
    id: "12",
    name: "Sprite Chill Cherry Lime",
    description: "La nueva Sprite viral con un toque de cereza y lima extra refrescante.",
    price: 2.50,
    image: "/images/catalog/sprite.jpg",
    category: "bebidas",
    badge: "viral",
  },
  {
    id: "13",
    name: "Vidal Chili Peppers",
    description: "Gomitas en forma de chile picante con un toque de fuego real. ¡Atrévete!",
    price: 3.00,
    image: "/images/catalog/vidal.jpg",
    category: "pikantes",
  }
];
