import fs from "fs/promises";
import path from "path";
import { QuoteRequest, QuoteRequestStatus } from "@/types/quote-request";

const filePath = path.join(process.cwd(), "src/data/quote-requests.json");

export async function getQuoteRequests(): Promise<QuoteRequest[]> {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent) as QuoteRequest[];
  } catch (error) {
    console.error("Lỗi đọc file quote-requests.json:", error);
    return [];
  }
}

export async function saveQuoteRequests(requests: QuoteRequest[]): Promise<boolean> {
  try {
    await fs.writeFile(filePath, JSON.stringify(requests, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Lỗi ghi file quote-requests.json:", error);
    return false;
  }
}

export async function addQuoteRequest(
  data: Omit<QuoteRequest, "id" | "status" | "adminNote" | "createdAt" | "updatedAt">
): Promise<QuoteRequest | null> {
  const requests = await getQuoteRequests();
  const now = new Date().toISOString();
  const newRequest: QuoteRequest = {
    ...data,
    id: `req_${Date.now()}`,
    status: "chua-xu-ly",
    adminNote: "",
    createdAt: now,
    updatedAt: now,
  };

  requests.unshift(newRequest); // new items on top
  const success = await saveQuoteRequests(requests);
  return success ? newRequest : null;
}

export async function updateQuoteRequest(
  id: string,
  updates: Partial<Pick<QuoteRequest, "status" | "adminNote">>
): Promise<QuoteRequest | null> {
  const requests = await getQuoteRequests();
  const index = requests.findIndex((r) => r.id === id);

  if (index === -1) return null;

  const updatedReq: QuoteRequest = {
    ...requests[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  requests[index] = updatedReq;
  const success = await saveQuoteRequests(requests);
  return success ? updatedReq : null;
}

export async function deleteQuoteRequest(id: string): Promise<boolean> {
  const requests = await getQuoteRequests();
  const filtered = requests.filter((r) => r.id !== id);
  if (filtered.length === requests.length) return false;
  return await saveQuoteRequests(filtered);
}
