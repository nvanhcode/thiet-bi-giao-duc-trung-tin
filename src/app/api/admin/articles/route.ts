import { NextResponse } from "next/server";
import { getArticles, saveArticles } from "@/lib/getArticles";
import { Article } from "@/types/article";

export async function GET() {
  const articles = await getArticles();
  return NextResponse.json(articles);
}

export async function POST(req: Request) {
  try {
    const body: Article[] = await req.json();
    const success = await saveArticles(body);

    if (success) {
      return NextResponse.json({ message: "Lưu danh sách bài viết thành công!", data: body });
    } else {
      return NextResponse.json({ error: "Không thể lưu tệp articles.json" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Dữ liệu bài viết không hợp lệ" }, { status: 400 });
  }
}
