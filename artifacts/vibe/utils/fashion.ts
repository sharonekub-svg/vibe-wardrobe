import { FashionItem } from "@/context/AppContext";

export function mapApiItem(i: {
  id: string;
  name: string;
  price: number;
  formattedPrice: string;
  imageUrl: string;
  category: string;
  buyUrl: string;
  tags?: string[];
  collection?: string;
}): FashionItem {
  return {
    id: i.id,
    name: i.name,
    price: i.price,
    formattedPrice: i.formattedPrice,
    imageUrl: i.imageUrl,
    category: i.category,
    buyUrl: i.buyUrl,
    tags: i.tags ?? [],
    collection: i.collection ?? "ladies",
  };
}

export function getCollectionLabel(age: number | undefined): string {
  return age !== undefined && age < 20 ? "H&M Divided" : "H&M Women's";
}
