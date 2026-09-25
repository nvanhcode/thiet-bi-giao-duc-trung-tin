import fs from "fs/promises";
import path from "path";
import { QuoteRequest, QuoteRequestStatus } from "@/types/quote-request";

const filePath = path.join(process.cwd(), "src/data/quote-requests.json");

export async function getQuoteRequests(): Promise<QuoteRequest[]> {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const rawData = JSON.parse(fileContent) as any[];
    
    // Normalize data for legacy items without tracking code or items
    return rawData.map((item, index) => {
      const trackingCode = item.trackingCode || `BG-${(100000 + index).toString()}`;
      return {
        id: item.id || `req_${Date.now()}_${index}`,
        trackingCode,
        fullName: item.fullName || "Khách hàng",
        phone: item.phone || "",
        email: item.email || "",
        customerType: item.customerType || "",
        city: item.city || "",
        note: item.note || "",
        items: item.items || [],
        status: item.status || "chua-xu-ly",
        adminNote: item.adminNote || "",
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString(),
      };
    });
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

function generateTrackingCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "BG-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function addQuoteRequest(
  data: Omit<QuoteRequest, "id" | "trackingCode" | "status" | "adminNote" | "createdAt" | "updatedAt">
): Promise<QuoteRequest | null> {
  const requests = await getQuoteRequests();
  const now = new Date().toISOString();
  
  let trackingCode = generateTrackingCode();
  while (requests.some((r) => r.trackingCode === trackingCode)) {
    trackingCode = generateTrackingCode();
  }

  const newRequest: QuoteRequest = {
    ...data,
    id: `req_${Date.now()}`,
    trackingCode,
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
  const index = requests.findIndex((r) => r.id === id || r.trackingCode === id);

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

export async function getQuoteRequestByTrackingCodeOrPhone(query: string): Promise<QuoteRequest[]> {
  const requests = await getQuoteRequests();
  const q = query.trim().toUpperCase();
  const qPhone = query.trim().toLowerCase();

  return requests.filter(
    (r) =>
      (r.trackingCode && r.trackingCode.toUpperCase() === q) ||
      (r.id && r.id.toUpperCase() === q) ||
      (r.phone && r.phone.replace(/\s+/g, "").includes(qPhone.replace(/\s+/g, "")))
  );
}

export async function deleteQuoteRequest(id: string): Promise<boolean> {
  const requests = await getQuoteRequests();
  const filtered = requests.filter((r) => r.id !== id && r.trackingCode !== id);
  if (filtered.length === requests.length) return false;
  return await saveQuoteRequests(filtered);
}
