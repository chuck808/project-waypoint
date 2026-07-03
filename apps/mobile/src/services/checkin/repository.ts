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
