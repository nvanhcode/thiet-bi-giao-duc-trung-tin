import { NextResponse } from "next/server";
import { processAndSaveImage } from "@/lib/uploadHelper";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Không tìm thấy file hình ảnh trong dữ liệu gửi lên" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await processAndSaveImage(buffer, file.name);

    return NextResponse.json({
      message: "Tải ảnh và tối ưu thành công!",
      ...result,
    });
  } catch (error) {
    console.error("Lỗi upload ảnh:", error);
    return NextResponse.json({ error: "Không thể xử lý hình ảnh tải lên" }, { status: 500 });
  }
}
