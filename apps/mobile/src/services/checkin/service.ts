import { supabase } from "../../lib/supabase";
import type {
  CheckInMethod,
  CheckInResolution,
  PerformCheckInResult,
} from "./types";
import {
  createCheckIn,
  getLatestCheckInSince,
  getQrCode,
  getRecognitionForCheckIn,
} from "./repository";
import { startOfVenueDayISO } from "./time";
import { addVisitToActiveWalk, getActiveWalk } from "../walks";
import { normaliseInvitation } from "@waypoint/validation";

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
    const qr = await getQrCode(normaliseInvitation(code));

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
      // Business-authored, per location (0013). Absent until the host
      // writes one -- the card renders only what is genuinely said.
      ...(qr.business_locations?.welcome_message
        ? { welcomeMessage: qr.business_locations.welcome_message }
        : {}),
      // No stamp preview: recognitions are rule-earned server-side and
      // the client cannot honestly promise one before the write. The
      // optional StampPreview stays in the type for a future
      // server-side rules preview.
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
  method: CheckInMethod,
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

    // Ambient trail context: consumed, never invented (0003: captured
    // at write or absent forever). getActiveWalk() has already applied
    // the venue-day expiry, so a stale walk cannot stamp a false edge.
    const activeWalk = await getActiveWalk();

    const checkIn = await createCheckIn({
      userId: auth.user.id,
      businessLocationId: ref.businessLocationId,
      qrCodeId: ref.qrCodeId,
      checkInMethod: method,
      trailId: activeWalk?.trailId,
    });

    if (activeWalk) {
      // Pass the walk already resolved above, not a fresh getActiveWalk()
      // call -- the journal entry must land against the same walk that
      // was used to decide this check-in's trailId, not whatever is
      // active by the time this write completes.
      await addVisitToActiveWalk(activeWalk, {
        checkInId: checkIn.id,
        businessLocationId: ref.businessLocationId,
        placeName: ref.placeName,
        businessName: ref.businessName,
        visitedAt: checkIn.checked_in_at,
      });
    }

    // The award, if any, was written by the database trigger inside
    // the same transaction as the check-in. We only ask what happened.
    const recognition = await getRecognitionForCheckIn(checkIn.id);

    return {
      outcome: "recorded",
      message: "Visit remembered.",
      checkInId: checkIn.id,
      businessLocationId: ref.businessLocationId,
      trailId: activeWalk?.trailId,
      ...(recognition ? { recognition } : {}),
    };
  } catch (err) {
    return {
      outcome: "failed",
      reason: err instanceof Error ? err.message : JSON.stringify(err),
    };
  }
}
