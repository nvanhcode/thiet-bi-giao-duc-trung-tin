import { NextResponse } from "next/server";
import { addQuoteRequest, getQuoteRequestByTrackingCodeOrPhone, updateQuoteRequest } from "@/lib/getQuoteRequests";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code") || searchParams.get("search");

    if (!code) {
      return NextResponse.json({ error: "Thiếu mã báo giá hoặc số điện thoại tra cứu" }, { status: 400 });
    }

    const results = await getQuoteRequestByTrackingCodeOrPhone(code);
    return NextResponse.json({ data: results });
  } catch (error) {
    console.error("API GET /api/quote-requests error:", error);
    return NextResponse.json({ error: "Lỗi tra cứu báo giá" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, phone, email, customerType, city, note, items } = body;

    if (!fullName || !fullName.trim()) {
      return NextResponse.json(
        { error: "Vui lòng nhập họ và tên của bạn" },
        { status: 400 }
      );
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { error: "Vui lòng nhập số điện thoại liên hệ" },
        { status: 400 }
      );
    }

    const newRequest = await addQuoteRequest({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : "",
      customerType: customerType || "",
      city: city || "",
      note: note ? note.trim() : "",
      items: Array.isArray(items) ? items : [],
    });

    if (newRequest) {
      return NextResponse.json(
        { message: "Gửi yêu cầu báo giá thành công", data: newRequest },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { error: "Lỗi hệ thống, không thể lưu yêu cầu" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API POST /api/quote-requests Error:", error);
    return NextResponse.json(
      { error: "Dữ liệu gửi lên không hợp lệ" },
      { status: 400 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Thiếu mã báo giá hoặc trạng thái" }, { status: 400 });
    }

    // Allow user to respond with nguoi-dung-dong-y or nguoi-dung-tu-choi
    if (!["nguoi-dung-dong-y", "nguoi-dung-tu-choi"].includes(status)) {
      return NextResponse.json({ error: "Trạng thái phản hồi không hợp lệ" }, { status: 400 });
    }

    const updated = await updateQuoteRequest(id, { status });
    if (updated) {
      return NextResponse.json({ message: "Phản hồi báo giá thành công", data: updated });
    } else {
      return NextResponse.json({ error: "Không tìm thấy yêu cầu báo giá" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Lỗi xử lý phản hồi" }, { status: 500 });
  }
}
