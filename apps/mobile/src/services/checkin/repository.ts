import { supabase } from "../../lib/supabase";

export async function getQrCode(code: string) {
  const { data, error } = await supabase
    .from("qr_codes")
    .select(
      `
      *,
      business_locations (
        *,
        businesses (*)
      )
    `,
    )
    .eq("code_value", code)
    .eq("status", "active")
    .single();

  if (error) throw error;

  return data;
}

export async function getLatestCheckInSince(input: {
  userId: string;
  businessLocationId: string;
  since: string;
}) {
  const { data, error } = await supabase
    .from("check_ins")
    .select("checked_in_at")
    .eq("user_id", input.userId)
    .eq("business_location_id", input.businessLocationId)
    .neq("verification_status", "rejected")
    .gte("checked_in_at", input.since)
    .order("checked_in_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function createCheckIn(input: {
  userId: string;
  businessLocationId: string;
  qrCodeId: string;
  checkInMethod: "qr" | "manual";
  trailId?: string;
}) {
  const { data, error } = await supabase
    .from("check_ins")
    .insert({
      user_id: input.userId,
      business_location_id: input.businessLocationId,
      qr_code_id: input.qrCodeId,
      check_in_method: input.checkInMethod,
      ...(input.trailId ? { trail_id: input.trailId } : {}),
      verification_status: "verified",
    })
    .select("*")
    .single();

  if (error) throw error;

  return data;
}




/** What the database awarded for this check-in, if anything. Awards are
 *  written by the check_ins trigger (0012) in the same transaction as
 *  the insert, so this read is consistent immediately. */
export async function getRecognitionForCheckIn(
  checkInId: string,
): Promise<{ title: string } | null> {
  const { data, error } = await supabase
    .from("earned_stamps")
    .select("stamp_definitions ( title )")
    .eq("source_type", "check_in")
    .eq("source_id", checkInId)
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  // PostgREST embeds a belongs-to relationship as a single object, but
  // supabase-js's generated type for a raw select string widens it to
  // an array; normalise both shapes instead of asserting past the type.
  const embedded = data?.stamp_definitions;
  const stampDefinition = Array.isArray(embedded) ? embedded[0] : embedded;

  return stampDefinition?.title ? { title: stampDefinition.title } : null;
}
