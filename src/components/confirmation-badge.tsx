"use client";

import { countries } from "@/lib/countries";
import {
  BADGE_TEMPLATE,
  DEFAULT_BADGE_CATEGORY,
  getBadgeCountryLabel,
  getBadgeQrUrl,
  getNameFontSize,
} from "@/lib/badge-template";

interface ConfirmationBadgeProps {
  firstName: string;
  lastName: string;
  companyName: string;
  countryCode: string;
  registrationCode: string;
  category?: string;
  position?: string;
}

export function ConfirmationBadge({
  firstName,
  lastName,
  companyName,
  countryCode,
  registrationCode,
  category = DEFAULT_BADGE_CATEGORY,
  position = "",
}: ConfirmationBadgeProps) {
  const countryName = getBadgeCountryLabel(
    countries.find((c) => c.code === countryCode)?.name || countryCode
  );
  const qrUrl = getBadgeQrUrl(registrationCode);
  const fullName = `${firstName} ${lastName}`.trim();
  const nameFontSize = getNameFontSize(fullName);

  return (
    <div
      className="mx-auto flex flex-col bg-white shadow-2xl relative my-4"
      style={{
        width: BADGE_TEMPLATE.width,
        height: BADGE_TEMPLATE.height,
        backgroundImage: `url('${BADGE_TEMPLATE.backgroundImageUrl}')`,
        backgroundSize: `${BADGE_TEMPLATE.width} ${BADGE_TEMPLATE.height}`,
        backgroundRepeat: "no-repeat",
        fontFamily: "var(--font-montserrat), sans-serif",
      }}
    >
      <div style={{ height: BADGE_TEMPLATE.headerSpacerHeight, width: "100%" }}></div>

      <div
        style={{
          height: BADGE_TEMPLATE.contentAreaHeight,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "center",
          boxSizing: "border-box",
          padding: BADGE_TEMPLATE.contentPadding,
        }}
      >
        <div>
          <div style={{ fontSize: nameFontSize, fontWeight: "bold", textTransform: "uppercase", lineHeight: "normal", color: "#000" }}>
            {fullName}
          </div>
          {position && <div style={{ fontSize: BADGE_TEMPLATE.positionFontSize, fontWeight: "bold", color: "#000", textTransform: "uppercase", marginTop: BADGE_TEMPLATE.positionMarginTop, lineHeight: "normal" }}>{position}</div>}
        </div>
        
        <div>
          <div style={{ fontSize: BADGE_TEMPLATE.companyFontSize, color: "#333", marginTop: BADGE_TEMPLATE.companyMarginTop, fontWeight: "600", lineHeight: "normal" }}>{companyName}</div>
          <div style={{ fontSize: BADGE_TEMPLATE.countryFontSize, fontWeight: "bold", textTransform: "uppercase", color: "#000", lineHeight: "normal" }}>{countryName}</div>
        </div>
        
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={qrUrl}
            alt={`QR code for ${registrationCode}`}
            className="bg-white"
            style={{
              width: BADGE_TEMPLATE.qrPrintSize,
              height: BADGE_TEMPLATE.qrPrintSize,
            }}
          />
          <div
            style={{
              marginTop: BADGE_TEMPLATE.qrCodeMarginTop,
              fontSize: BADGE_TEMPLATE.qrCodeFontSize,
              fontWeight: 700,
              letterSpacing: BADGE_TEMPLATE.qrCodeLetterSpacing,
              color: "#000",
            }}
          >
            {registrationCode}
          </div>
        </div>
      </div>

      <div
        style={{
          height: BADGE_TEMPLATE.footerHeight,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          paddingTop: BADGE_TEMPLATE.footerPaddingTop,
        }}
      >
        <div style={{ fontSize: BADGE_TEMPLATE.badgeTypeFontSize, fontWeight: "900", textTransform: "uppercase", letterSpacing: BADGE_TEMPLATE.badgeTypeLetterSpacing, color: "#000" }}>
            {category}
        </div>
      </div>
    </div>
  );
}
