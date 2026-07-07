import QRCode from "qrcode";
import type { PageServerLoad } from "./$types";

/** The demo invitation is a real one: The Old Barn Café's live token.
 *  Scanning the landing page's QR lands on a genuine invitation page. */
const DEMO_TOKEN = "wp1-7XK4-Q2M9";

export const load: PageServerLoad = async ({ url }) => {
  const demoUrl = `${url.origin}/visit/${DEMO_TOKEN}`;

  const demoQr = await QRCode.toString(demoUrl, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 1,
  });

  return { demoQr, demoToken: DEMO_TOKEN };
};
