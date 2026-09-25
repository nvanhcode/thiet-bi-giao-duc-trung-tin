import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/getProducts";
import { getArticles } from "@/lib/getArticles";
import { getProjects } from "@/lib/getProjects";
import { searchMatch } from "@/lib/searchHelper";

export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    if (!q.trim()) {
      return NextResponse.json({ products: [], articles: [], projects: [] });
    }

    const [products, articles, projects] = await Promise.all([
      getProducts(),
      getArticles(),
      getProjects(),
    ]);

    // Filter products
    const filteredProducts = products.filter((p) => {
      if (searchMatch(p.name, q)) return true;
      if (searchMatch(p.code, q)) return true;
      if (searchMatch(p.summary, q)) return true;
      if (searchMatch(p.description, q)) return true;
      if (searchMatch(p.origin, q)) return true;
      if (searchMatch(p.blockCount, q)) return true;
      if (searchMatch(p.slideType, q)) return true;
      if (searchMatch(p.feature, q)) return true;
      if (searchMatch(p.investmentLevel, q)) return true;
      if (
        p.specifications &&
        p.specifications.some(
          (s) => searchMatch(s.key, q) || searchMatch(s.value, q)
        )
      ) {
        return true;
      }
      return false;
    });

    // Filter articles
    const filteredArticles = articles.filter((a) => {
      if (searchMatch(a.title, q)) return true;
      if (searchMatch(a.excerpt, q)) return true;
      if (searchMatch(a.content, q)) return true;
      if (searchMatch(a.categoryName, q)) return true;
      if (searchMatch(a.author, q)) return true;
      return false;
    });

    // Filter projects
    const filteredProjects = projects.filter((p) => {
      if (searchMatch(p.title, q)) return true;
      if (searchMatch(p.tag, q)) return true;
      if (searchMatch(p.address, q)) return true;
      if (searchMatch(p.scale, q)) return true;
      if (searchMatch(p.client, q)) return true;
      if (searchMatch(p.excerpt, q)) return true;
      if (searchMatch(p.description, q)) return true;
      return false;
    });

    return NextResponse.json({
      products: limit ? filteredProducts.slice(0, limit) : filteredProducts,
      articles: limit ? filteredArticles.slice(0, limit) : filteredArticles,
      projects: limit ? filteredProjects.slice(0, limit) : filteredProjects,
    });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi tìm kiếm" },
      { status: 500 }
    );
  }
}
