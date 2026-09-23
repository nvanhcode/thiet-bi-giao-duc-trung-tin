import { NextResponse } from "next/server";
import { getArticleCategories, saveArticleCategories } from "@/lib/getArticles";
import { ArticleCategory } from "@/types/article";

export async function GET() {
  const categories = await getArticleCategories();
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  try {
    const body: ArticleCategory[] = await req.json();
    const success = await saveArticleCategories(body);

    if (success) {
      return NextResponse.json({ message: "Lưu danh sách danh mục bài viết thành công!", data: body });
    } else {
      return NextResponse.json({ error: "Không thể lưu tệp article-categories.json" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Dữ liệu danh mục không hợp lệ" }, { status: 400 });
  }
}
