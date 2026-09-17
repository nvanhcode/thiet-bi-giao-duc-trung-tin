import fs from "fs/promises";
import path from "path";
import { SiteInfo, defaultSiteInfo } from "@/types/site-info";

export type { SiteInfo };
export { defaultSiteInfo };

const filePath = path.join(process.cwd(), "src/data/site-info.json");

export async function getSiteInfo(): Promise<SiteInfo> {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    return { ...defaultSiteInfo, ...JSON.parse(fileContent) };
  } catch (error) {
    console.error("Lỗi đọc file site-info.json, sử dụng giá trị mặc định:", error);
    return defaultSiteInfo;
  }
}

export async function saveSiteInfo(data: SiteInfo): Promise<boolean> {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Lỗi ghi file site-info.json:", error);
    return false;
  }
}
