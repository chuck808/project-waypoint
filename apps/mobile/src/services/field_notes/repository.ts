import type { Database } from "@waypoint/database";
import { supabase } from "../../lib/supabase";
import type { CreateFieldNoteInput } from "./types";

export type FieldNoteRow = Pick<
  Database["public"]["Tables"]["field_notes"]["Row"],
  "id" | "category" | "severity" | "message" | "source" | "observed_at" | "expires_at"
>;

const fieldNoteSelect =
  "id, category, severity, message, source, observed_at, expires_at";

export async function createFieldNoteRow(input: CreateFieldNoteInput) {
  const { data: auth, error: authError } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!auth.user) throw new Error("You must be signed in.");

  const { data, error } = await supabase
    .from("field_notes")
    .insert({
      user_id: auth.user.id,
      check_in_id: input.checkInId ?? null,
      business_location_id: input.businessLocationId ?? null,
      trail_id: input.trailId ?? null,
      category: input.category,
      severity: input.severity ?? "info",
      message: input.message?.trim() || null,
      source: "explorer",
      visibility: "public",
    })
    .select(fieldNoteSelect)
    .single();

  if (error) throw error;

  return data as FieldNoteRow;
}

export async function getFieldNoteRowsForPlace(
  businessLocationId: string,
  limit = 5,
): Promise<FieldNoteRow[]> {
  const { data, error } = await supabase
    .from("field_notes")
    .select(fieldNoteSelect)
    .eq("business_location_id", businessLocationId)
    .eq("visibility", "public")
    .is("resolved_at", null)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order("observed_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []) as FieldNoteRow[];
}

export async function getFieldNoteRowsForTrail(
  trailId: string,
  limit = 5,
): Promise<FieldNoteRow[]> {
  const { data, error } = await supabase
    .from("field_notes")
    .select(fieldNoteSelect)
    .eq("trail_id", trailId)
    .eq("visibility", "public")
    .is("resolved_at", null)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order("observed_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []) as FieldNoteRow[];
}
