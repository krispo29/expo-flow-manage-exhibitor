// utils/print-badge.ts

import { normalizeRegistrationCode, openBadgePrintWindow } from "@/lib/badge-template";

interface PrintBadgeData {
  firstName: string;
  lastName: string;
  companyName: string;
  country: string;
  registrationCode: string;
  category?: string;
  eventDate?: string;
  venue?: string;
  logoUrl?: string;
  organizerName?: string;
  position?: string;
  badgeType?: string;
}

export function printBadge(data: PrintBadgeData): void {
  const registrationCode = normalizeRegistrationCode(data.registrationCode);

  openBadgePrintWindow(`Print Badge - ${registrationCode}`, [
    {
      firstName: data.firstName,
      lastName: data.lastName,
      companyName: data.companyName,
      countryLabel: data.country,
      registrationCode,
      category: data.badgeType || data.category || "VISITOR",
      position: data.position || "",
    },
  ]);
}
