import { mapFieldNote } from "./mapper";
import {
  createFieldNoteRow,
  getFieldNoteRowsForPlace,
  getFieldNoteRowsForTrail,
} from "./repository";
import type { CreateFieldNoteInput, FieldNote } from "./types";

export async function createFieldNote(
  input: CreateFieldNoteInput,
): Promise<FieldNote> {
  const row = await createFieldNoteRow(input);
  return mapFieldNote(row);
}

export async function getFieldNotesForPlace(
  businessLocationId: string,
): Promise<FieldNote[]> {
  const rows = await getFieldNoteRowsForPlace(businessLocationId);
  return rows.map(mapFieldNote);
}

export async function getFieldNotesForTrail(
  trailId: string,
): Promise<FieldNote[]> {
  const rows = await getFieldNoteRowsForTrail(trailId);
  return rows.map(mapFieldNote);
}
