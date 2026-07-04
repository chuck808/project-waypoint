import { normaliseInvitation } from "@waypoint/validation";
import { supabase } from "$lib/supabase";
import type { PageServerLoad } from "./$types";

type Invitation =
  | {
      outcome: "found";
      placeName: string;
      businessName: string;
      category: string;
      canonicalToken: string;
    }
  | { outcome: "not_recognised" };

export const load: PageServerLoad = async ({ params }): Promise<Invitation> => {
  const token = normaliseInvitation(params.token);

  const { data } = await supabase
    .from("qr_codes")
    .select(
      `
      code_value,
      business_locations (
        name,
        businesses ( name, category )
      )
    `,
    )
    .eq("code_value", token)
    .maybeSingle();

  const location = data?.business_locations;

  if (!data || !location?.businesses) {
    return { outcome: "not_recognised" };
  }

  return {
    outcome: "found",
    placeName: location.name ?? location.businesses.name,
    businessName: location.businesses.name,
    category: location.businesses.category,
    canonicalToken: data.code_value,
  };
};
