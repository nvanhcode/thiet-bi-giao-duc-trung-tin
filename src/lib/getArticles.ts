import fs from "fs/promises";
import path from "path";
import { Article, ArticleCategory } from "@/types/article";

const articlesFilePath = path.join(process.cwd(), "src/data/articles.json");
const categoriesFilePath = path.join(process.cwd(), "src/data/article-categories.json");

export async function getArticles(): Promise<Article[]> {
  try {
    const fileContent = await fs.readFile(articlesFilePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Lỗi đọc file articles.json:", error);
    return [];
  }
}

export async function saveArticles(articles: Article[]): Promise<boolean> {
  try {
    await fs.writeFile(articlesFilePath, JSON.stringify(articles, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Lỗi ghi file articles.json:", error);
    return false;
  }
}

export async function getArticleCategories(): Promise<ArticleCategory[]> {
  try {
    const fileContent = await fs.readFile(categoriesFilePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Lỗi đọc file article-categories.json:", error);
    return [];
  }
}

export async function saveArticleCategories(categories: ArticleCategory[]): Promise<boolean> {
  try {
    await fs.writeFile(categoriesFilePath, JSON.stringify(categories, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Lỗi ghi file article-categories.json:", error);
    return false;
  }
}
