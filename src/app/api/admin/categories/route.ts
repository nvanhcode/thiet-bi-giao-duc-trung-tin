import { NextResponse } from "next/server";
import { getCategories, saveCategories } from "@/lib/getCategories";
import { Category } from "@/types/category";

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  try {
    const body: Category[] = await req.json();
    const success = await saveCategories(body);

    if (success) {
      return NextResponse.json({ message: "Lưu danh sách danh mục thành công!", data: body });
    } else {
      return NextResponse.json({ error: "Không thể lưu tệp categories.json" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }
}
