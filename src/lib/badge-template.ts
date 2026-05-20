"use client";

import { normalizeRegistrationCode } from "@/lib/registration-code";

export { normalizeRegistrationCode };

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
  headerSpacerHeight: "1.95cm",
  contentAreaHeight: "6.55cm",
  contentPadding: "0.25cm 0.5cm 0.15cm",
  footerHeight: "3cm",
  footerPadding: "0.5cm",
  nameFontSize: "20pt",
  nameMaxFontSizePt: 20,
  nameMinFontSizePt: 10,
  nameMaxWidth: "9.5cm",
  positionFontSize: "13pt",
  positionMarginTop: "2px",
  companyFontSize: "13pt",
  companyMarginTop: "5px",
  countryFontSize: "13pt",
  qrPrintSize: "2cm",
  qrCanvasSize: 100,
  qrSectionMinHeight: "2.15cm",
  badgeTypeFontSize: "30pt",
  badgeTypeLetterSpacing: "2px",
  badgeTypeTranslateY: "0.45cm",
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
  const normalizedRegistrationCode = normalizeRegistrationCode(registrationCode);
  const params = new URLSearchParams({
    data: normalizedRegistrationCode,
    ecc: "M",
    margin: "0",
    size: "100x100",
  });

  return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
}

export function buildBadgeHtml(data: BadgeTemplateData): string {
  const fullName = `${normalizeText(data.firstName)} ${normalizeText(data.lastName)}`.trim();
  const position = normalizeText(data.position);
  const companyName = normalizeText(data.companyName);
  const countryLabel = getBadgeCountryLabel(data.countryLabel);
  const category = getBadgeCategory(data.category);
  const registrationCode = normalizeRegistrationCode(data.registrationCode);
  const qrUrl = getBadgeQrUrl(registrationCode);

  return `
    <section class="badge-print-page">
      <div class="badge-print-container">
        <div class="badge-print-header-spacer"></div>

        <div class="badge-print-content">
          <div class="badge-print-top-group">
            <div class="badge-print-name-section">
              <div class="badge-print-name">${escapeHtml(fullName)}</div>
              ${position ? `<div class="badge-print-position">${escapeHtml(position)}</div>` : ""}
            </div>

            <div class="badge-print-info-section">
              <div class="badge-print-company">${escapeHtml(companyName)}</div>
              <div class="badge-print-country">${escapeHtml(countryLabel)}</div>
            </div>
          </div>

          <div class="badge-print-qr-section">
            <div class="badge-print-qr-frame">
              <img src="${qrUrl}" alt="QR Code" />
            </div>
          </div>
        </div>

        <div class="badge-print-footer">
          <div class="badge-print-type">${escapeHtml(category)}</div>
        </div>
      </div>
    </section>
  `;
}

function getNameFitScript() {
  return `
    function fitBadgeNames() {
      var maxFontSizePt = ${BADGE_TEMPLATE.nameMaxFontSizePt};
      var minFontSizePt = ${BADGE_TEMPLATE.nameMinFontSizePt};
      var pointsPerPixel = 72 / 96;
      var names = document.querySelectorAll('.badge-print-name');

      names.forEach(function (nameElement) {
        nameElement.style.fontSize = maxFontSizePt + 'pt';

        var availableWidth = nameElement.clientWidth;
        var requiredWidth = nameElement.scrollWidth;
        var currentFontSizePx = parseFloat(window.getComputedStyle(nameElement).fontSize);
        var currentFontSizePt = currentFontSizePx * pointsPerPixel;

        if (availableWidth <= 0 || requiredWidth <= 0 || currentFontSizePt <= 0) {
          return;
        }

        var nextFontSizePt = requiredWidth <= availableWidth
          ? currentFontSizePt
          : currentFontSizePt * (availableWidth / requiredWidth);

        nextFontSizePt = Math.max(minFontSizePt, Math.min(maxFontSizePt, nextFontSizePt));
        nameElement.style.fontSize = nextFontSizePt.toFixed(2) + 'pt';
      });
    }

    window.addEventListener('resize', fitBadgeNames);
  `;
}

function getBadgeStyles() {
  return `
    @page {
      size: ${BADGE_TEMPLATE.pageSize};
      margin: 0;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html,
    body {
      width: auto;
      height: auto;
      margin: 0;
      padding: 0;
      background: #fff;
      color: #000;
      font-family: Arial, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .badge-print-root {
      display: block;
      width: auto;
      max-width: none;
      margin: 0;
      padding: 0;
      gap: 0;
    }

    .badge-print-page {
      display: block;
      width: ${BADGE_TEMPLATE.width};
      height: ${BADGE_TEMPLATE.height};
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: #fff;
      page-break-after: always;
      page-break-inside: avoid;
      break-after: page;
      break-inside: avoid;
    }

    .badge-print-page:last-of-type {
      page-break-after: auto;
      break-after: auto;
    }

    .badge-print-container {
      position: relative;
      display: flex;
      width: ${BADGE_TEMPLATE.width};
      height: ${BADGE_TEMPLATE.height};
      flex-direction: column;
      overflow: hidden;
      background: #fff;
    }

    .badge-print-header-spacer {
      width: 100%;
      height: ${BADGE_TEMPLATE.headerSpacerHeight};
    }

    .badge-print-content {
      display: flex;
      width: 100%;
      height: ${BADGE_TEMPLATE.contentAreaHeight};
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      padding: ${BADGE_TEMPLATE.contentPadding};
      text-align: center;
    }

    .badge-print-top-group {
      display: flex;
      width: 100%;
      flex-direction: column;
      align-items: center;
    }

    .badge-print-name-section {
      margin-bottom: 5px;
    }

    .badge-print-name {
      width: 100%;
      max-width: ${BADGE_TEMPLATE.nameMaxWidth};
      overflow: hidden;
      color: #000;
      font-size: ${BADGE_TEMPLATE.nameFontSize};
      font-weight: 700;
      line-height: 1;
      text-overflow: clip;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .badge-print-position {
      margin-top: ${BADGE_TEMPLATE.positionMarginTop};
      color: #000;
      font-size: ${BADGE_TEMPLATE.positionFontSize};
      font-weight: 400;
      line-height: 1.2;
      text-transform: uppercase;
    }

    .badge-print-info-section {
      max-width: ${BADGE_TEMPLATE.nameMaxWidth};
      margin: ${BADGE_TEMPLATE.companyMarginTop} 0;
    }

    .badge-print-company {
      color: #333;
      font-size: ${BADGE_TEMPLATE.companyFontSize};
      font-weight: 400;
      line-height: 1.2;
    }

    .badge-print-country {
      margin-top: 2px;
      color: #333;
      font-size: ${BADGE_TEMPLATE.countryFontSize};
      font-weight: 400;
      line-height: 1.2;
      text-transform: uppercase;
    }

    .badge-print-qr-section {
      display: flex;
      min-height: ${BADGE_TEMPLATE.qrSectionMinHeight};
      margin-top: auto;
      align-items: center;
      justify-content: center;
    }

    .badge-print-qr-frame {
      display: flex;
      width: ${BADGE_TEMPLATE.qrPrintSize};
      height: ${BADGE_TEMPLATE.qrPrintSize};
      align-items: center;
      justify-content: center;
      background: #fff;
    }

    .badge-print-qr-frame img {
      display: block;
      width: 100%;
      height: 100%;
    }

    .badge-print-footer {
      display: flex;
      width: 100%;
      height: ${BADGE_TEMPLATE.footerHeight};
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      padding: ${BADGE_TEMPLATE.footerPadding};
    }

    .badge-print-type {
      width: 100%;
      color: #000;
      font-size: ${BADGE_TEMPLATE.badgeTypeFontSize};
      font-weight: 900;
      letter-spacing: ${BADGE_TEMPLATE.badgeTypeLetterSpacing};
      line-height: 1;
      text-align: center;
      text-transform: uppercase;
      transform: translateY(${BADGE_TEMPLATE.badgeTypeTranslateY});
    }

    @media print {
      html,
      body {
        width: auto;
        height: auto;
        margin: 0;
        padding: 0;
        background: #fff;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .badge-print-root {
        display: block !important;
        width: auto !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 0 !important;
        gap: 0 !important;
      }

      .badge-print-page {
        display: block !important;
        width: ${BADGE_TEMPLATE.width} !important;
        height: ${BADGE_TEMPLATE.height} !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
        page-break-after: always;
        page-break-inside: avoid;
        break-after: page;
        break-inside: avoid;
      }

      .badge-print-page:last-of-type {
        page-break-after: auto;
        break-after: auto;
      }
    }
  `;
}

export function buildBadgePrintDocument(title: string, badges: BadgeTemplateData[]): string {
  const badgesHtml = badges.map(buildBadgeHtml).join("");

  return `
    <!doctype html>
    <html>
      <head>
        <title>${escapeHtml(title)}</title>
        <style>${getBadgeStyles()}</style>
      </head>
      <body>
        <main class="badge-print-root">
          ${badgesHtml}
        </main>
        <script>
          ${getNameFitScript()}
        </script>
      </body>
    </html>
  `;
}

function openBadgeWindow(documentHtml: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const previewWindow = window.open("", "_blank", "popup=yes,width=1100,height=900");
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
          window.onload = function () {
            window.setTimeout(function () {
              fitBadgeNames();
              window.requestAnimationFrame(function () {
                window.requestAnimationFrame(function () {
                  window.print();
                  window.onafterprint = function () {
                    window.close();
                  };
                });
              });
            }, 500);
          };
        </script>
      </body>`
  ));
}
