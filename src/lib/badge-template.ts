"use client";

export interface BadgeTemplateData {
  firstName: string;
  lastName: string;
  companyName: string;
  countryLabel?: string;
  registrationCode: string;
  category?: string;
  position?: string;
}

export const BADGE_TEMPLATE = {
  pageSize: "10.5cm 13cm",
  width: "10.5cm",
  height: "13cm",
  backgroundImageUrl: "https://static.expoflow.co/img/badge-preview.png",
  headerSpacerHeight: "3.8cm",
  contentAreaHeight: "6.2cm",
  contentPadding: "0.3cm 0.5cm 1.2cm",
  footerHeight: "3cm",
  footerPaddingTop: "1.2cm",
  nameFontSize: "30pt",
  positionFontSize: "15pt",
  positionMarginTop: "4px",
  companyFontSize: "13pt",
  companyMarginTop: "5px",
  countryFontSize: "12pt",
  qrPrintSize: "2.2cm",
  qrCanvasSize: 105,
  qrCodeFontSize: "10pt",
  qrCodeLetterSpacing: "1.2px",
  qrCodeMarginTop: "0.1cm",
  badgeTypeFontSize: "20pt",
  badgeTypeLetterSpacing: "2px",
} as const;

export const DEFAULT_BADGE_CATEGORY = "VISITOR";
export const DEFAULT_BADGE_COUNTRY = "THAILAND";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeText(value?: string, fallback = ""): string {
  return value?.trim() || fallback;
}

export function getBadgeCountryLabel(country?: string): string {
  return normalizeText(country, DEFAULT_BADGE_COUNTRY).toUpperCase();
}

function getBadgeCategory(category?: string): string {
  return normalizeText(category, DEFAULT_BADGE_CATEGORY).toUpperCase();
}

export function getBadgeQrUrl(registrationCode: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    registrationCode
  )}`;
}

/**
 * Dynamically scales the name font size based on character count.
 * Short names get full size, long names scale down to remain readable.
 */
export function getNameFontSize(fullName: string): string {
  const len = fullName.trim().length;
  const maxPt = 26;
  const minPt = 12;
  const shortThreshold = 10; // names ≤10 chars get full size
  const longThreshold = 25;  // names ≥25 chars get minimum size

  if (len <= shortThreshold) return `${maxPt}pt`;
  if (len >= longThreshold) return `${minPt}pt`;

  // Linear interpolation between thresholds
  const ratio = (len - shortThreshold) / (longThreshold - shortThreshold);
  const pt = Math.round(maxPt - ratio * (maxPt - minPt));
  return `${pt}pt`;
}

export function buildBadgeHtml(data: BadgeTemplateData): string {
  const fullName = `${normalizeText(data.firstName)} ${normalizeText(data.lastName)}`.trim();
  const position = normalizeText(data.position);
  const companyName = normalizeText(data.companyName);
  const countryLabel = getBadgeCountryLabel(data.countryLabel);
  const category = getBadgeCategory(data.category);
  const qrUrl = getBadgeQrUrl(data.registrationCode);

  const nameFontSize = getNameFontSize(fullName);

  return `
    <div class="badge-container">
      <div class="header-spacer"></div>
      <div class="content-area">
        <div class="top-group">
          <div class="name" style="font-size: ${nameFontSize}">${escapeHtml(fullName)}</div>
          ${position ? `<div class="position">${escapeHtml(position)}</div>` : ""}
        </div>
        <div class="info-group">
          <div class="company">${escapeHtml(companyName)}</div>
          <div class="country">${escapeHtml(countryLabel)}</div>
        </div>
        <div class="qr-group">
          <img src="${qrUrl}" class="qr-code" />
          <div class="registration-code">${escapeHtml(data.registrationCode)}</div>
        </div>
      </div>
      <div class="footer-content">
        <div class="badge-type">${escapeHtml(category)}</div>
      </div>
    </div>
  `;
}

export function buildBadgePrintDocument(title: string, badges: BadgeTemplateData[]): string {
  const badgesHtml = badges
    .map((badge, index) => {
      const pageBreakClass = index < badges.length - 1 ? " page-break" : "";
      return buildBadgeHtml(badge).replace('class="badge-container"', `class="badge-container${pageBreakClass}"`);
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${escapeHtml(title)}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
        <style>
          *, *::before, *::after { box-sizing: border-box; }
          @page { size: ${BADGE_TEMPLATE.pageSize}; margin: 0; }
          body {
            margin: 0;
            padding: 20px 0 0;
            font-family: 'Montserrat', sans-serif;
            background-color: #f0f0f0;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .badge-container {
            width: ${BADGE_TEMPLATE.width};
            height: ${BADGE_TEMPLATE.height};
            display: flex;
            flex-direction: column;
            background-color: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            background-image: url('${BADGE_TEMPLATE.backgroundImageUrl}');
            background-size: ${BADGE_TEMPLATE.width} ${BADGE_TEMPLATE.height};
            background-repeat: no-repeat;
            position: relative;
            margin-bottom: 20px;
          }
          .header-spacer { height: ${BADGE_TEMPLATE.headerSpacerHeight}; width: 100%; }
          .content-area {
            height: ${BADGE_TEMPLATE.contentAreaHeight};
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            text-align: center;
            box-sizing: border-box;
            padding: ${BADGE_TEMPLATE.contentPadding};
          }
          .footer-content {
            height: ${BADGE_TEMPLATE.footerHeight};
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding-top: ${BADGE_TEMPLATE.footerPaddingTop};
          }
          .name {
            font-size: ${BADGE_TEMPLATE.nameFontSize};
            font-weight: bold;
            text-transform: uppercase;
            line-height: normal;
            color: #000;
          }
          .position {
            font-size: ${BADGE_TEMPLATE.positionFontSize};
            font-weight: bold;
            color: #000;
            text-transform: uppercase;
            margin-top: ${BADGE_TEMPLATE.positionMarginTop};
          }
          .company {
            font-size: ${BADGE_TEMPLATE.companyFontSize};
            color: #333;
            margin-top: ${BADGE_TEMPLATE.companyMarginTop};
          }
          .country {
            font-size: ${BADGE_TEMPLATE.countryFontSize};
            font-weight: bold;
            text-transform: uppercase;
            color: #000;
          }
          .qr-code { width: ${BADGE_TEMPLATE.qrPrintSize}; height: ${BADGE_TEMPLATE.qrPrintSize}; }
          .qr-group {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .registration-code {
            margin-top: ${BADGE_TEMPLATE.qrCodeMarginTop};
            font-size: ${BADGE_TEMPLATE.qrCodeFontSize};
            font-weight: 700;
            letter-spacing: ${BADGE_TEMPLATE.qrCodeLetterSpacing};
            color: #000;
          }
          .badge-type {
            font-size: ${BADGE_TEMPLATE.badgeTypeFontSize};
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: ${BADGE_TEMPLATE.badgeTypeLetterSpacing};
            color: #000;
          }
          .page-break { page-break-after: always; }
          @media print {
            body {
              background-color: white;
              padding: 0;
              display: block;
            }
            .badge-container {
              box-shadow: none;
              background-image: none !important;
              -webkit-print-color-adjust: exact;
              margin: 0;
            }
            .page-break:last-child { page-break-after: avoid !important; }
          }
        </style>
      </head>
      <body>
        ${badgesHtml}
      </body>
    </html>
  `;
}

function openBadgeWindow(documentHtml: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const previewWindow = window.open("", "_blank");
  if (!previewWindow) {
    return;
  }

  previewWindow.document.write(documentHtml);
  previewWindow.document.close();
}

export function openBadgePreviewWindow(title: string, badges: BadgeTemplateData[]): void {
  if (badges.length === 0) {
    return;
  }

  openBadgeWindow(buildBadgePrintDocument(title, badges));
}

export function openBadgePrintWindow(title: string, badges: BadgeTemplateData[]): void {
  if (typeof window === "undefined" || badges.length === 0) {
    return;
  }

  openBadgeWindow(buildBadgePrintDocument(title, badges).replace(
    "</body>",
    `        <script>
          window.onload = () => {
            setTimeout(() => {
              window.print();
              window.close();
            }, 1000);
          };
        </script>
      </body>`
  ));
}
