import fs from "fs";
import path from "path";
import { Project } from "@/types/project";

const filePath = path.join(process.cwd(), "src/data/projects.json");

export async function getProjects(): Promise<Project[]> {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const fileData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileData);
  } catch (error) {
    console.error("Error reading projects.json:", error);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) || null;
}
