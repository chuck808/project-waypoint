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
      checkInRef: JSON.stringify({
        qrCodeId: qr.id,
        businessLocationId: qr.business_location_id,
      }),
    };
  } catch {
    return {
      outcome: "not_recognised",
      reason: "unknown_code",
    };
  }
}

import { supabase } from "../../lib/supabase";
import type { PerformCheckInResult } from "./types";
import {
  createCheckIn,
  createEarnedStamp,
  getBusinessStampDefinition,
  getUserPassport,
} from "./repository";

type CheckInRef = {
  qrCodeId: string;
  businessLocationId: string;
};

function parseCheckInRef(value: string): CheckInRef {
  return JSON.parse(value) as CheckInRef;
}

export async function performCheckIn(
  checkInRef: string,
): Promise<PerformCheckInResult> {
  try {
    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      return {
        outcome: "failed",
        reason: "You must be signed in.",
      };
    }

    console.log("CHECK-IN USER", auth.user.id);

    const ref = parseCheckInRef(checkInRef);

    const checkIn = await createCheckIn({
      userId: auth.user.id,
      businessLocationId: ref.businessLocationId,
      qrCodeId: ref.qrCodeId,
    });

    const passport = await getUserPassport(auth.user.id);
    const stampDefinition = await getBusinessStampDefinition();

    await createEarnedStamp({
      passportId: passport.id,
      stampDefinitionId: stampDefinition.id,
      checkInId: checkIn.id,
    });

    return {
      outcome: "recorded",
      message: "Visit remembered.",
    };
  } catch (err) {
    console.log("PERFORM CHECK-IN ERROR", err);

    return {
      outcome: "failed",
      reason: err instanceof Error ? err.message : JSON.stringify(err),
    };
  }
}
