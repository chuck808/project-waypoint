import type { CheckInResolution } from "./types";
import { getQrCode } from "./repository";

export async function resolveCheckIn(code: string): Promise<CheckInResolution> {
  try {
    const qr = await getQrCode(code.trim());

    return {
      outcome: "ready",
      placeName: qr.business_locations?.name ?? "Unknown place",
      businessName:
        qr.business_locations?.businesses?.name ?? "Unknown business",
      welcomeMessage: "Muddy boots welcome",
      stamp: {
        title: "First Local Stop",
      },
      checkInRef: qr.id,
    };
  } catch {
    return {
      outcome: "not_recognised",
      reason: "unknown_code",
    };
  }
}
