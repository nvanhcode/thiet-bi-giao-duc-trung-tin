import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Project } from "@/types/project";

const filePath = path.join(process.cwd(), "src/data/projects.json");

function getProjectsData(): Project[] {
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

function saveProjectsData(data: Project[]): boolean {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing projects.json:", error);
    return false;
  }
}

export async function GET() {
  const data = getProjectsData();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const data: Project[] = await req.json();
    const success = saveProjectsData(data);
    if (success) {
      return NextResponse.json({ message: "Lưu danh sách công trình thành công!" });
    }
    return NextResponse.json({ error: "Không thể lưu dữ liệu công trình" }, { status: 500 });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi xử lý yêu cầu" }, { status: 500 });
  }
}
