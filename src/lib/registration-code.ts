export function normalizeRegistrationCode(registrationCode?: string | null): string {
  return registrationCode?.trim().toUpperCase() || "";
}
