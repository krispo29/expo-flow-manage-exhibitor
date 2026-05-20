"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { countries } from "@/lib/countries";
import {
  BADGE_TEMPLATE,
  DEFAULT_BADGE_CATEGORY,
  getBadgeCountryLabel,
  getBadgeQrUrl,
  normalizeRegistrationCode,
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

const POINTS_PER_PIXEL = 72 / 96;

function calculateFitFontSizePt(element: HTMLElement) {
  const availableWidth = element.clientWidth;
  const requiredWidth = element.scrollWidth;
  const currentFontSizePx = Number.parseFloat(window.getComputedStyle(element).fontSize);
  const currentFontSizePt = currentFontSizePx * POINTS_PER_PIXEL;

  if (availableWidth <= 0 || requiredWidth <= 0 || currentFontSizePt <= 0) {
    return BADGE_TEMPLATE.nameMaxFontSizePt;
  }

  const nextFontSize =
    requiredWidth === availableWidth
      ? currentFontSizePt
      : currentFontSizePt * (availableWidth / requiredWidth);

  return Math.max(
    BADGE_TEMPLATE.nameMinFontSizePt,
    Math.min(BADGE_TEMPLATE.nameMaxFontSizePt, nextFontSize)
  );
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
  const nameRef = useRef<HTMLDivElement>(null);
  const fullName = `${firstName} ${lastName}`.trim();
  const countryName = getBadgeCountryLabel(
    countries.find((c) => c.code === countryCode)?.name || countryCode
  );
  const normalizedRegistrationCode = normalizeRegistrationCode(registrationCode);
  const qrUrl = getBadgeQrUrl(normalizedRegistrationCode);
  const [nameFontSizePt, setNameFontSizePt] = useState<number>(BADGE_TEMPLATE.nameMaxFontSizePt);

  useLayoutEffect(() => {
    const nameElement = nameRef.current;
    if (!nameElement) {
      return;
    }

    let frameId = 0;

    const fitName = () => {
      const nextFontSizePt = calculateFitFontSizePt(nameElement);

      setNameFontSizePt((currentFontSizePt) =>
        Math.abs(currentFontSizePt - nextFontSizePt) < 0.05
          ? currentFontSizePt
          : nextFontSizePt
      );
    };

    const scheduleFit = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(fitName);
    };

    const resizeObserver = new ResizeObserver(scheduleFit);
    resizeObserver.observe(nameElement);

    if (nameElement.parentElement) {
      resizeObserver.observe(nameElement.parentElement);
    }

    scheduleFit();
    window.addEventListener("resize", scheduleFit);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleFit);
    };
  }, [fullName]);

  return (
    <section className="badge-print-page mx-auto my-4 bg-white shadow-2xl">
      <div className="badge-print-container">
        <div className="badge-print-header-spacer" />

        <div className="badge-print-content">
          <div className="badge-print-top-group">
            <div className="badge-print-name-section">
              <div
                className="badge-print-name"
                ref={nameRef}
                style={{ fontSize: `${nameFontSizePt}pt` }}
              >
                {fullName}
              </div>
              {position ? <div className="badge-print-position">{position}</div> : null}
            </div>

            <div className="badge-print-info-section">
              <div className="badge-print-company">{companyName}</div>
              <div className="badge-print-country">{countryName}</div>
            </div>
          </div>

          <div className="badge-print-qr-section">
            <div className="badge-print-qr-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrUrl} alt={`QR code for ${normalizedRegistrationCode}`} />
            </div>
          </div>
        </div>

        <div className="badge-print-footer">
          <div className="badge-print-type">{category}</div>
        </div>
      </div>

      <style jsx>{`
        .badge-print-page {
          width: ${BADGE_TEMPLATE.width};
          height: ${BADGE_TEMPLATE.height};
          overflow: hidden;
          color: #000;
          text-align: center;
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
      `}</style>
    </section>
  );
}
