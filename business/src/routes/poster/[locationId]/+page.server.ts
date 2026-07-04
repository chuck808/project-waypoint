import { error, redirect } from "@sveltejs/kit";
import QRCode from "qrcode";
import { PUBLIC_INVITATION_BASE_URL } from "$env/static/public";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
  const { user } = await locals.safeGetSession();

  if (!user) redirect(303, "/sign-in");

  // RLS (0008) already scopes this to the caller's businesses; a
  // non-member asking for someone else's poster simply finds nothing.
  const { data } = await locals.supabase
    .from("business_locations")
    .select(
      `
      name,
      businesses ( name ),
      qr_codes ( code_value, status )
    `,
    )
    .eq("id", params.locationId)
    .maybeSingle();

  const activeCode = data?.qr_codes.find((code) => code.status === "active");

  if (!data || !data.businesses || !activeCode) {
    error(404, "No active invitation for this location.");
  }

  const visitUrl = `${PUBLIC_INVITATION_BASE_URL}/visit/${activeCode.code_value}`;

  const qrSvg = await QRCode.toString(visitUrl, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 1,
  });

  return {
    placeName: data.name ?? data.businesses.name,
    businessName: data.businesses.name,
    token: activeCode.code_value,
    visitUrl,
    qrSvg,
  };
};
