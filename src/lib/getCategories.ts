import fs from "fs/promises";
import path from "path";
import { Category } from "@/types/category";

const filePath = path.join(process.cwd(), "src/data/categories.json");

export async function getCategories(): Promise<Category[]> {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Lỗi đọc file categories.json:", error);
    return [];
  }
}

export async function saveCategories(categories: Category[]): Promise<boolean> {
  try {
    await fs.writeFile(filePath, JSON.stringify(categories, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Lỗi ghi file categories.json:", error);
    return false;
  }
}
