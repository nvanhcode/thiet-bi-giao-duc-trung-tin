import fs from "fs/promises";
import path from "path";
import { Product } from "@/types/product";

const filePath = path.join(process.cwd(), "src/data/products.json");

export async function getProducts(): Promise<Product[]> {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Lỗi đọc file products.json:", error);
    return [];
  }
}

export async function saveProducts(products: Product[]): Promise<boolean> {
  try {
    await fs.writeFile(filePath, JSON.stringify(products, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Lỗi ghi file products.json:", error);
    return false;
  }
}
