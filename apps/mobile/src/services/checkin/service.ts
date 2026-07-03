import { getQrCode } from "./repository";

export async function validateQrCode(code: string) {
  return getQrCode(code);
}
