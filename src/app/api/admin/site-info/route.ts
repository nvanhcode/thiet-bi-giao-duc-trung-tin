import { NextResponse } from "next/server";
import { getSiteInfo, saveSiteInfo, SiteInfo } from "@/lib/getSiteInfo";

export async function GET() {
  const data = await getSiteInfo();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body: SiteInfo = await req.json();
    const success = await saveSiteInfo(body);

    if (success) {
      return NextResponse.json({ message: "Cập nhật thông tin thành công!", data: body });
    } else {
      return NextResponse.json({ error: "Không thể lưu thông tin vào file JSON" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }
}
