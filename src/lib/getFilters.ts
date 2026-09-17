import fs from "fs/promises";
import path from "path";
import { FilterOptionsData, defaultFilterOptions } from "@/types/filter";

export type { FilterOptionsData };
export { defaultFilterOptions };

const filePath = path.join(process.cwd(), "src/data/filters.json");

export async function getFilters(): Promise<FilterOptionsData> {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    return { ...defaultFilterOptions, ...JSON.parse(fileContent) };
  } catch (error) {
    console.error("Lỗi đọc file filters.json, sử dụng mặc định:", error);
    return defaultFilterOptions;
  }
}

export async function saveFilters(filters: FilterOptionsData): Promise<boolean> {
  try {
    await fs.writeFile(filePath, JSON.stringify(filters, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Lỗi ghi file filters.json:", error);
    return false;
  }
}
