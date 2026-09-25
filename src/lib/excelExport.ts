import ExcelJS from "exceljs";
import { QuoteRequest, statusLabels, customerTypeLabels, cityLabels } from "@/types/quote-request";

export async function exportQuoteToExcel(quote: QuoteRequest) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Phúc An Minh - Thiết Bị Giáo Dục";
  workbook.lastModifiedBy = "Admin";
  workbook.created = new Date();

  const formattedDate = new Date(quote.createdAt).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const customerTypeStr = customerTypeLabels[quote.customerType || ""] || quote.customerType || "Chưa xác định";
  const cityStr = cityLabels[quote.city || ""] || quote.city || "Toàn Quốc";
  const statusStr = statusLabels[quote.status] || quote.status;

  // -------------------------------------------------------------
  // SHEET 1: DANH MỤC BÁO GIÁ (SUMMARY)
  // -------------------------------------------------------------
  const mainSheet = workbook.addWorksheet("Danh Mục Báo Giá", {
    views: [{ showGridLines: true }],
  });

  // Main Title Banner
  mainSheet.mergeCells("A1:G1");
  const titleCell = mainSheet.getCell("A1");
  titleCell.value = "BẢNG YÊU CẦU BÁO GIÁ THIẾT BỊ GIÁO DỤC - MẦM NON";
  titleCell.font = { name: "Arial", size: 14, bold: true, color: { argb: "FFFFFF" } };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "C8102E" } };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  mainSheet.getRow(1).height = 40;

  // Customer Information Block Header
  mainSheet.mergeCells("A3:G3");
  const custHeaderCell = mainSheet.getCell("A3");
  custHeaderCell.value = "I. THÔNG TIN KHÁCH HÀNG & YÊU CẦU";
  custHeaderCell.font = { name: "Arial", size: 11, bold: true, color: { argb: "1E293B" } };
  custHeaderCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F1F5F9" } };
  mainSheet.getRow(3).height = 24;

  const infoRows = [
    ["Mã Báo Giá:", quote.trackingCode || quote.id, "Ngày Yêu Cầu:", formattedDate],
    ["Họ và Tên:", quote.fullName, "Số Điện Thoại:", quote.phone],
    ["Email Liên Hệ:", quote.email || "Chưa cung cấp", "Nhóm Khách Hàng:", customerTypeStr],
    ["Khu Vực / Tỉnh Thành:", cityStr, "Trạng Thái Báo Giá:", statusStr],
    ["Ghi Chú Yêu Cầu:", quote.note || "Không có ghi chú thêm", "", ""],
  ];

  let currentRow = 4;
  infoRows.forEach((row) => {
    mainSheet.getRow(currentRow).height = 20;

    mainSheet.getCell(`A${currentRow}`).value = row[0];
    mainSheet.getCell(`A${currentRow}`).font = { bold: true, size: 10 };
    mainSheet.getCell(`B${currentRow}`).value = row[1];
    mainSheet.getCell(`B${currentRow}`).font = { size: 10 };

    if (row[2]) {
      mainSheet.getCell(`D${currentRow}`).value = row[2];
      mainSheet.getCell(`D${currentRow}`).font = { bold: true, size: 10 };
      mainSheet.getCell(`E${currentRow}`).value = row[3];
      mainSheet.getCell(`E${currentRow}`).font = { size: 10 };
    }

    if (row[0] === "Ghi Chú Yêu Cầu:") {
      mainSheet.mergeCells(`B${currentRow}:G${currentRow}`);
    }

    currentRow++;
  });

  // Table Section Header
  currentRow += 1;
  mainSheet.mergeCells(`A${currentRow}:G${currentRow}`);
  const tableHeaderCell = mainSheet.getCell(`A${currentRow}`);
  tableHeaderCell.value = "II. DANH MỤC SẢN PHẨM CẦN BÁO GIÁ";
  tableHeaderCell.font = { name: "Arial", size: 11, bold: true, color: { argb: "1E293B" } };
  tableHeaderCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F1F5F9" } };
  mainSheet.getRow(currentRow).height = 24;

  // Table Columns Header
  currentRow += 1;
  const headers = ["STT", "Mã SP", "Tên Sản Phẩm", "Số Lượng", "Đơn Giá Dự Kiến", "Thành Tiền", "Ghi Chú"];
  const headerRow = mainSheet.getRow(currentRow);
  headerRow.height = 26;

  headers.forEach((h, i) => {
    const colLetter = String.fromCharCode(65 + i);
    const cell = mainSheet.getCell(`${colLetter}${currentRow}`);
    cell.value = h;
    cell.font = { bold: true, color: { argb: "FFFFFF" }, size: 10 };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "334155" } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // Populate Table Data
  const items = quote.items && quote.items.length > 0 ? quote.items : [];
  currentRow += 1;

  if (items.length === 0) {
    mainSheet.mergeCells(`A${currentRow}:G${currentRow}`);
    const emptyCell = mainSheet.getCell(`A${currentRow}`);
    emptyCell.value = "Không có sản phẩm trong danh mục báo giá";
    emptyCell.alignment = { horizontal: "center" };
    emptyCell.font = { italic: true, color: { argb: "64748B" } };
    currentRow += 1;
  } else {
    items.forEach((item, index) => {
      const row = mainSheet.getRow(currentRow);
      row.height = 22;

      const priceVal = typeof item.price === "number" ? item.price : 0;
      const totalVal = priceVal * item.quantity;

      mainSheet.getCell(`A${currentRow}`).value = index + 1;
      mainSheet.getCell(`A${currentRow}`).alignment = { horizontal: "center" };

      mainSheet.getCell(`B${currentRow}`).value = item.code || `SP-${item.id}`;
      mainSheet.getCell(`B${currentRow}`).alignment = { horizontal: "center" };

      mainSheet.getCell(`C${currentRow}`).value = item.name;

      mainSheet.getCell(`D${currentRow}`).value = item.quantity;
      mainSheet.getCell(`D${currentRow}`).alignment = { horizontal: "center" };

      mainSheet.getCell(`E${currentRow}`).value = priceVal > 0 ? priceVal : "Liên hệ";
      if (priceVal > 0) mainSheet.getCell(`E${currentRow}`).numFmt = "#,##0 VNĐ";

      mainSheet.getCell(`F${currentRow}`).value = totalVal > 0 ? totalVal : "Liên hệ";
      if (totalVal > 0) mainSheet.getCell(`F${currentRow}`).numFmt = "#,##0 VNĐ";

      mainSheet.getCell(`G${currentRow}`).value = item.origin ? `Nguồn gốc: ${item.origin}` : "";

      // Apply borders
      ["A", "B", "C", "D", "E", "F", "G"].forEach((col) => {
        mainSheet.getCell(`${col}${currentRow}`).border = {
          top: { style: "thin", color: { argb: "E2E8F0" } },
          left: { style: "thin", color: { argb: "E2E8F0" } },
          bottom: { style: "thin", color: { argb: "E2E8F0" } },
          right: { style: "thin", color: { argb: "E2E8F0" } },
        };
      });

      currentRow++;
    });
  }

  // Set column widths for main sheet
  mainSheet.columns = [
    { width: 8 },  // STT
    { width: 16 }, // Mã SP
    { width: 38 }, // Tên sản phẩm
    { width: 12 }, // Số lượng
    { width: 18 }, // Đơn giá
    { width: 20 }, // Thành tiền
    { width: 24 }, // Ghi chú
  ];

  // -------------------------------------------------------------
  // SUBSEQUENT SHEETS: DETAILED PRODUCT INFO FOR EACH ITEM
  // -------------------------------------------------------------
  items.forEach((item, index) => {
    // Excel sheet name max 31 chars, no invalid characters \ / ? * [ ] :
    const safeItemName = (item.code || item.name)
      .replace(/[\\/*?:\[\]]/g, "")
      .slice(0, 24);
    const sheetTitle = `SP ${index + 1} - ${safeItemName}`.slice(0, 30);

    const prodSheet = workbook.addWorksheet(sheetTitle, {
      views: [{ showGridLines: true }],
    });

    // Product Title Header
    prodSheet.mergeCells("A1:E1");
    const pTitleCell = prodSheet.getCell("A1");
    pTitleCell.value = `THÔNG TIN CHI TIẾT SẢN PHẨM SỐ ${index + 1}`;
    pTitleCell.font = { name: "Arial", size: 12, bold: true, color: { argb: "FFFFFF" } };
    pTitleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "1E293B" } };
    pTitleCell.alignment = { horizontal: "center", vertical: "middle" };
    prodSheet.getRow(1).height = 32;

    // Overview Table
    prodSheet.mergeCells("A3:E3");
    const pOverviewHeader = prodSheet.getCell("A3");
    pOverviewHeader.value = "I. THÔNG TIN CHUNG";
    pOverviewHeader.font = { name: "Arial", size: 11, bold: true, color: { argb: "C8102E" } };

    const prodInfoRows = [
      ["Tên sản phẩm:", item.name],
      ["Mã sản phẩm:", item.code || `SP-${item.id}`],
      ["Số lượng báo giá:", `${item.quantity} bộ/chiếc`],
      ["Giá tham khảo:", typeof item.price === "number" && item.price > 0 ? `${item.price.toLocaleString("vi-VN")} VNĐ` : "Liên hệ"],
      ["Số khối:", item.blockCount || "N/A"],
      ["Mức đầu tư:", item.investmentLevel || "N/A"],
      ["Nguồn gốc xuất xứ:", item.origin || "N/A"],
      ["Kiểu máng trượt:", item.slideType || "N/A"],
      ["Tính năng tích hợp:", item.feature || "N/A"],
    ];

    let pRow = 4;
    prodInfoRows.forEach(([label, val]) => {
      prodSheet.getRow(pRow).height = 20;
      prodSheet.getCell(`A${pRow}`).value = label;
      prodSheet.getCell(`A${pRow}`).font = { bold: true, size: 10 };
      prodSheet.mergeCells(`B${pRow}:E${pRow}`);
      prodSheet.getCell(`B${pRow}`).value = val;
      prodSheet.getCell(`B${pRow}`).font = { size: 10 };
      pRow++;
    });

    // Specifications Section
    pRow += 1;
    prodSheet.mergeCells(`A${pRow}:E${pRow}`);
    const pSpecHeader = prodSheet.getCell(`A${pRow}`);
    pSpecHeader.value = "II. THÔNG SỐ KỸ THUẬT CHI TIẾT";
    pSpecHeader.font = { name: "Arial", size: 11, bold: true, color: { argb: "C8102E" } };
    prodSheet.getRow(pRow).height = 24;

    pRow += 1;
    const specHeaderRow = prodSheet.getRow(pRow);
    specHeaderRow.height = 22;
    prodSheet.mergeCells(`A${pRow}:B${pRow}`);
    prodSheet.getCell(`A${pRow}`).value = "Tên thông số";
    prodSheet.getCell(`A${pRow}`).font = { bold: true, color: { argb: "FFFFFF" }, size: 10 };
    prodSheet.getCell(`A${pRow}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "475569" } };

    prodSheet.mergeCells(`C${pRow}:E${pRow}`);
    prodSheet.getCell(`C${pRow}`).value = "Giá trị thông số";
    prodSheet.getCell(`C${pRow}`).font = { bold: true, color: { argb: "FFFFFF" }, size: 10 };
    prodSheet.getCell(`C${pRow}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "475569" } };

    pRow += 1;
    if (item.specifications && item.specifications.length > 0) {
      item.specifications.forEach((spec) => {
        prodSheet.getRow(pRow).height = 20;
        prodSheet.mergeCells(`A${pRow}:B${pRow}`);
        prodSheet.getCell(`A${pRow}`).value = spec.key;
        prodSheet.getCell(`A${pRow}`).font = { bold: true, size: 10 };

        prodSheet.mergeCells(`C${pRow}:E${pRow}`);
        prodSheet.getCell(`C${pRow}`).value = spec.value;
        prodSheet.getCell(`C${pRow}`).font = { size: 10 };

        // borders
        ["A", "B", "C", "D", "E"].forEach((col) => {
          prodSheet.getCell(`${col}${pRow}`).border = {
            top: { style: "thin", color: { argb: "CBD5E1" } },
            left: { style: "thin", color: { argb: "CBD5E1" } },
            bottom: { style: "thin", color: { argb: "CBD5E1" } },
            right: { style: "thin", color: { argb: "CBD5E1" } },
          };
        });
        pRow++;
      });
    } else {
      prodSheet.mergeCells(`A${pRow}:E${pRow}`);
      prodSheet.getCell(`A${pRow}`).value = "Thông số kỹ thuật tiêu chuẩn theo quy chuẩn mầm non.";
      prodSheet.getCell(`A${pRow}`).font = { italic: true, color: { argb: "64748B" } };
      pRow++;
    }

    // Description Section
    if (item.summary || item.description) {
      pRow += 1;
      prodSheet.mergeCells(`A${pRow}:E${pRow}`);
      const pDescHeader = prodSheet.getCell(`A${pRow}`);
      pDescHeader.value = "III. MÔ TẢ & GHI CHÚ SẢN PHẨM";
      pDescHeader.font = { name: "Arial", size: 11, bold: true, color: { argb: "C8102E" } };

      pRow += 1;
      const cleanDesc = (item.summary || item.description || "")
        .replace(/<[^>]*>?/gm, "")
        .trim();

      prodSheet.mergeCells(`A${pRow}:E${pRow + 2}`);
      const descCell = prodSheet.getCell(`A${pRow}`);
      descCell.value = cleanDesc;
      descCell.font = { size: 10, color: { argb: "334155" } };
      descCell.alignment = { wrapText: true, vertical: "top" };
    }

    prodSheet.columns = [
      { width: 22 },
      { width: 24 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
    ];
  });

  // Generate buffer and trigger browser download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const fileName = `Bao_Gia_${quote.trackingCode || quote.id}_${quote.fullName.replace(/\s+/g, "_")}.xlsx`;

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
