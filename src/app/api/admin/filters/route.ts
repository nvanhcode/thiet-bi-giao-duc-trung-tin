import { NextResponse } from "next/server";
import { getFilters, saveFilters, FilterOptionsData } from "@/lib/getFilters";

export async function GET() {
  const data = await getFilters();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body: FilterOptionsData = await req.json();
    const success = await saveFilters(body);

    if (success) {
      return NextResponse.json({ message: "Cập nhật thuộc tính bộ lọc thành công!", data: body });
    } else {
      return NextResponse.json({ error: "Không thể lưu tệp filters.json" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }
}
