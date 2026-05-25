export interface Candy {
  id: string;
  name: string;
  description: string;
  ownerReview: string;
  price: number;
  images: string[];
  category: string | string[];
  tag?: string;
  badge?: "nuevo" | "bestseller" | "viral" | "exclusivo" | "menu" | "top";
  stock?: number;
}

export const CANDIES: Candy[] = [
  {
    id: "1",
    name: "Lindt Dubai Pistachio",
    description: "El chocolate viral de Instagram. Relleno cremoso de pistacho y un toque crujiente de kunafa. Edición Limitada.",
    ownerReview: "¡Mi favorito absoluto! No saben cuánto busqué este chocolate para ustedes. Lo que más me gusta es ese 'crunch' del kunafa mezclado con la cremosidad del pistacho, es una experiencia que me hace sonreír cada vez que lo pruebo.",
    price: 15.00,
    images: ["/images/catalog/dubai-choc.jpg"],
    category: "tendencias",
    badge: "viral",
  },
  {
    id: "2",
    name: "Pulparindo Original",
    description: "El clásico pulparindo de tamarindo natural con sal y chile. Un balance perfecto entre ácido y picante.",
    ownerReview: "Si me conocen, saben que amo lo acidito. Este Pulparindo me recuerda a mi infancia; ese balance entre el tamarindo natural y el picantito es algo que siempre tengo en mi cartera para un antojo rápido.",
    price: 1.50,
    images: ["/images/catalog/pulparindo.png"],
    category: "pikantes",
  },
  {
    id: "3",
    name: "Skittles Giants Sour",
    description: "Versión gigante y extra ácida. Para los que buscan emociones fuertes en cada mordida.",
    ownerReview: "¿Saben qué es lo mejor de estos? Que son GIGANTES. Literalmente me paso minutos disfrutando solo uno. El polvito ácido que tienen por fuera me encanta, ¡les juro que les va a arrugar la cara de lo bueno que está!",
    price: 3.50,
    images: ["/images/catalog/skittles-sour.png"],
    category: "acidos",
  },
  {
    id: "4",
    name: "Feastables Milk Chocolate",
    description: "El chocolate de MrBeast. Sabor ultra cremoso con solo 5 ingredientes de alta calidad.",
    ownerReview: "Me sorprendió muchísimo lo simple y delicioso que es. Solo 5 ingredientes, ¡y se nota la calidad! Es el chocolate que siempre recomiendo cuando alguien quiere algo clásico pero elevado. ¡MrBeast realmente lo logró!",
    price: 6.00,
    images: ["/images/catalog/feastable.png"],
    category: "tendencias",
    badge: "nuevo",
  },
  {
    id: "5",
    name: "Nerds Gummy Clusters",
    description: "Gominolas masticables recubiertas de Nerds crujientes. Explosión de sabor en cada bocado.",
    ownerReview: "¡Son adictivos, en serio! Me encanta la textura: lo suavecito de la gomita en el centro y lo súper crujiente de los Nerds por fuera. Siempre que abro una bolsa en la oficina, desaparece en segundos.",
    price: 5.50,
    images: ["/images/catalog/nerds-clusters.jpg"],
    category: ["gomitas", "top"],
    badge: "bestseller",
  },
  {
    id: "6",
    name: "Reese's Peanut Butter Jars",
    description: "Cremosa mantequilla de maní con el chocolate clásico de Reese's en formato para compartir.",
    ownerReview: "Para los amantes de la mantequilla de maní como yo, esto es el paraíso. Me encanta que venga en este formato porque puedo controlar cuánto comer (aunque casi siempre termino comiendo más de la cuenta).",
    price: 4.50,
    images: ["/images/catalog/reeses.png"],
    category: "chocolates",
    badge: "exclusivo",
  },
  {
    id: "7",
    name: "Sour Patch Kids Hearts",
    description: "Edición especial de corazones. Primero ácidos, luego dulces. Perfectos para San Valentín.",
    ownerReview: "Son tan tiernos que me da penita comerlos, ¡pero son demasiado ricos! Ese inicio súper ácido que luego se vuelve dulce es mi parte favorita. Me encanta regalarlos porque siempre sacan una sonrisa.",
    price: 4.00,
    images: ["/images/catalog/sour-hearts.png"],
    category: "acidos",
    badge: "nuevo",
  },
  {
    id: "8",
    name: "Lucas Muecas Pepino",
    description: "Caramelo con polvo de chile sabor pepino. Tradición mexicana pura y divertida.",
    ownerReview: "El sabor a pepino con chile es algo que nunca falla. Me divierte muchísimo el empaque, siempre me lleva a esos momentos de risas compartiendo dulces diferentes con mis amigos.",
    price: 2.00,
    images: ["/images/catalog/lucas.png"],
    category: "pikantes",
  },
  {
    id: "9",
    name: "M&Ms Peanut Share Size",
    description: "El clásico maní tostado recubierto de chocolate y una capa crujiente de colores.",
    ownerReview: "¡Un clásico que nunca muere! Me encanta el maní tostado que usan, es súper crujiente. Es mi compañero ideal para las tardes de pelis en casa, ¡no puedo ver una sin mis M&Ms!",
    price: 3.00,
    images: ["/images/catalog/mms.png"],
    category: "chocolates",
    badge: "bestseller",
  },
  {
    id: "10",
    name: "Jolly Rancher Chewy Poppers",
    description: "Caramelos masticables con un centro líquido explosivo. Sabores frutales intensos.",
    ownerReview: "Lo que más me gusta es la sorpresa del centro líquido. Son explosiones de sabor frutal que me encantan para animar el día. El de sandía es mi favorito personal, ¡tienen que probarlo!",
    price: 4.80,
    images: ["/images/catalog/jolly.png"],
    category: "gomitas",
  },
  {
    id: "11",
    name: "Warheads Cubes Sour",
    description: "Cubos masticables recubiertos de polvo extra ácido. Solo para valientes.",
    ownerReview: "¡Advertencia: son MUY ácidos! Me encanta ver las caras que ponen mis clientes cuando los prueban por primera vez. Si eres valiente como yo y amas el reto de lo ácido, estos cubitos son para ti.",
    price: 4.20,
    images: ["/images/catalog/warheads.png"],
    category: "acidos",
  },
  {
    id: "12",
    name: "Sprite Chill Cherry Lime",
    description: "La nueva Sprite viral con un toque de cereza y lima extra refrescante.",
    ownerReview: "Tenía que traerla apenas la vi. El toque de cereza le da una vuelta increíble a la Sprite de siempre. Me encanta tomarla bien fría después de un día largo, es súper refrescante y diferente.",
    price: 2.50,
    images: ["/images/catalog/sprite.png"],
    category: "bebidas",
    badge: "viral",
  },
  {
    id: "13",
    name: "Vidal Chili Peppers",
    description: "Gomitas en forma de chile picante con un toque de fuego real. ¡Atrévete!",
    ownerReview: "Son tan divertidas. Parecen chiles de verdad y tienen ese toquecito de calor que te sorprende. Me encanta usarlas para decorar mesas de dulces, ¡siempre son el centro de atención!",
    price: 3.00,
    images: ["/images/catalog/vidal.png"],
    category: "pikantes",
  }
];
