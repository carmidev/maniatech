import { getProductsWithInventory } from './actions';
import { CANDIES, Candy } from "@/app/mock-data";
import { CatalogoClient } from "./CatalogoClient";

export const metadata = {
  title: "Catálogo | Dolce Candy Boutique",
  description: "Explora nuestras golosinas y cafés exclusivos.",
};

export const revalidate = 30;

const normalizeCategory = (cat: string | string[] | null): string[] => {
  if (!cat) return ["top"];
  const cats = Array.isArray(cat) ? cat : [cat];
  return cats.map(c =>
    String(c)
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace("pikantes", "picantes")
      .replace("tendencias", "top")
  );
};

export default async function CatalogoPage() {
  let mappedCandies: Candy[] = [];
  
  try {
    const result = await getProductsWithInventory();

    if (result.success && result.data) {
      mappedCandies = result.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description || "",
        ownerReview: item.owner_review || "",
        price: Number(item.price) || 0,
        images: item.images && item.images.length > 0 ? item.images : [CANDIES[0].images[0]],
        category: normalizeCategory(item.category),
        stock: item.inventory?.reduce((sum: number, loc: any) => sum + (loc.quantity || 0), 0) || 0,
        sku: item.sku,
        flavor: item.flavor || item.sabor,
        variant: item.variant,
      }));
    } else {
      console.error("Error fetching products:", result.error);
    }
  } catch (err) {
    console.error("Error in server component:", err);
  }

  return <CatalogoClient initialProducts={mappedCandies} />;
}
