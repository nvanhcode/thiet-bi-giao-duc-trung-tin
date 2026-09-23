import { NextResponse } from "next/server";
import { addQuoteRequest } from "@/lib/getQuoteRequests";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, phone, customerType, city, note } = body;

    if (!fullName || !phone) {
      return NextResponse.json(
        { error: "Họ tên và số điện thoại là bắt buộc" },
        { status: 400 }
      );
    }

    const newRequest = await addQuoteRequest({
      fullName: fullName.trim(),
      phone: phone.trim(),
      customerType: customerType || "",
      city: city || "",
      note: note ? note.trim() : "",
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
