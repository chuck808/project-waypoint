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

export async function createCheckIn(input: {
  userId: string;
  businessLocationId: string;
  qrCodeId: string;
}) {
  console.log("CREATE CHECK-IN INPUT", input);

  const { data, error } = await supabase
    .from("check_ins")
    .insert({
      user_id: input.userId,
      business_location_id: input.businessLocationId,
      qr_code_id: input.qrCodeId,
      check_in_method: "qr",
      verification_status: "verified",
    })
    .select("*")
    .single();

  if (error) throw error;

  return data;
}

export async function getUserPassport(userId: string) {
  const { data, error } = await supabase
    .from("passports")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (error) throw error;

  return data;
}

export async function getBusinessStampDefinition() {
  const { data, error } = await supabase
    .from("stamp_definitions")
    .select("*")
    .eq("title", "First Local Stop")
    .eq("stamp_type", "business")
    .eq("status", "active")
    .single();

  if (error) throw error;

  return data;
}

export async function createEarnedStamp(input: {
  passportId: string;
  stampDefinitionId: string;
  checkInId: string;
}) {
  const { data, error } = await supabase
    .from("earned_stamps")
    .insert({
      passport_id: input.passportId,
      stamp_definition_id: input.stampDefinitionId,
      source_type: "check_in",
      source_id: input.checkInId,
    })
    .select("*")
    .single();

  if (error) throw error;

  return data;
}
