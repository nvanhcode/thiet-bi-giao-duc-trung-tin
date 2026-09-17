import { NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/getProducts";
import { Product } from "@/types/product";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  try {
    const body: Product[] = await req.json();
    const success = await saveProducts(body);

    if (success) {
      return NextResponse.json({ message: "Lưu danh sách sản phẩm thành công!", data: body });
    } else {
      return NextResponse.json({ error: "Không thể lưu tệp products.json" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }
}
