import { NextResponse } from "next/server";
import {
  getQuoteRequests,
  updateQuoteRequest,
  deleteQuoteRequest,
} from "@/lib/getQuoteRequests";

export async function GET() {
  try {
    const data = await getQuoteRequests();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi tải danh sách yêu cầu báo giá" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, adminNote } = body;

    if (!id) {
      return NextResponse.json({ error: "Thiếu ID yêu cầu" }, { status: 400 });
    }

    const updated = await updateQuoteRequest(id, {
      ...(status !== undefined && { status }),
      ...(adminNote !== undefined && { adminNote }),
    });

    if (updated) {
      return NextResponse.json({ message: "Cập nhật thành công", data: updated });
    } else {
      return NextResponse.json(
        { error: "Không tìm thấy yêu cầu để cập nhật" },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Thiếu ID yêu cầu" }, { status: 400 });
    }

    const success = await deleteQuoteRequest(id);
    if (success) {
      return NextResponse.json({ message: "Xóa yêu cầu thành công" });
    } else {
      return NextResponse.json(
        { error: "Không tìm thấy yêu cầu để xóa" },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: "Lỗi xử lý yêu cầu" }, { status: 500 });
  }
}
