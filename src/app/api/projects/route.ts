import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Project } from "@/types/project";

const filePath = path.join(process.cwd(), "src/data/projects.json");

export async function GET() {
  try {
    if (!fs.existsSync(filePath)) {
      return NextResponse.json([]);
    }
    const fileData = fs.readFileSync(filePath, "utf-8");
    const projects: Project[] = JSON.parse(fileData);
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error reading projects.json:", error);
    return NextResponse.json([], { status: 500 });
  }
}
