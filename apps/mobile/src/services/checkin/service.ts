import { supabase } from "../../lib/supabase";
import type { CheckInResolution, PerformCheckInResult } from "./types";
import {
  createCheckIn,
  createEarnedStamp,
  getBusinessStampDefinition,
  getLatestCheckInSince,
  getQrCode,
  getUserPassport,
} from "./repository";
import { startOfVenueDayISO } from "./time";

type CheckInRef = {
  qrCodeId: string;
  businessLocationId: string;
  placeName: string;
  businessName: string;
};

/**
 * The ref is opaque to everyone outside this module: base64 today, a
 * server-signed token once resolution moves into the edge function. The
 * names ride along as claims so the write path can describe the place
 * without a second lookup.
 */
function mintCheckInRef(ref: CheckInRef): string {
  // encodeURIComponent first: btoa only accepts Latin-1, and place or
  // business names can carry curly quotes, accents, or emoji.
  return btoa(encodeURIComponent(JSON.stringify(ref)));
}

function parseCheckInRef(value: string): CheckInRef {
  return JSON.parse(decodeURIComponent(atob(value))) as CheckInRef;
}

/**
 * "Already visited" means: this user has a non-rejected check-in at this
 * location since the start of the venue's calendar day. Check-ins are the
 * source of truth for visits; the passport is only an outcome of them.
 */
async function findTodaysVisit(businessLocationId: string) {
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) return null;

  return getLatestCheckInSince({
    userId: auth.user.id,
    businessLocationId,
    since: startOfVenueDayISO(),
  });
}

export async function resolveCheckIn(code: string): Promise<CheckInResolution> {
  try {
    const qr = await getQrCode(code.trim());

    const placeName = qr.business_locations?.name ?? "Unknown place";
    const businessName =
      qr.business_locations?.businesses?.name ?? "Unknown business";

    const existingVisit = await findTodaysVisit(qr.business_location_id);

    if (existingVisit) {
      return {
        outcome: "already_visited",
        placeName,
        businessName,
        lastVisitedAt: existingVisit.checked_in_at,
      };
    }

    return {
      outcome: "ready",
      placeName,
      businessName,
      welcomeMessage: "Muddy boots welcome",
      stamp: {
        title: "First Local Stop",
      },
      checkInRef: mintCheckInRef({
        qrCodeId: qr.id,
        businessLocationId: qr.business_location_id,
        placeName,
        businessName,
      }),
    };
  } catch {
    return {
      outcome: "not_recognised",
      reason: "unknown_code",
    };
  }
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

    const ref = parseCheckInRef(checkInRef);

    // Re-check at the moment of writing. The check in resolveCheckIn is a
    // courtesy for the UI; this one is the guard. A resolution can go stale
    // between scan and tap (second device, slow hands, shared code).
    const existingVisit = await findTodaysVisit(ref.businessLocationId);

    if (existingVisit) {
      return {
        outcome: "already_visited",
        placeName: ref.placeName,
        businessName: ref.businessName,
        lastVisitedAt: existingVisit.checked_in_at,
      };
    }

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
    return {
      outcome: "failed",
      reason: err instanceof Error ? err.message : JSON.stringify(err),
    };
  }
}
