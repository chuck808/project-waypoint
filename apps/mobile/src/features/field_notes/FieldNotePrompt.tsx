import { useMemo, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import {
  AppText,
  Card,
  FilterChip,
  PrimaryButton,
} from "../../components";
import {
  createFieldNote,
  labelForFieldNoteCategory,
  type FieldNoteCategory,
} from "../../services/field_notes";
import { theme } from "../../theme";

type FieldNotePromptProps = {
  checkInId?: string;
  businessLocationId?: string;
  trailId?: string;
  onSaved?: () => void;
  onSkip?: () => void;
};

const quickNotes: { category: FieldNoteCategory; label: string }[] = [
  { category: "mud_bog", label: "Boggy" },
  { category: "bridge_stile_gate", label: "Bridge / stile" },
  { category: "fallen_tree", label: "Tree down" },
  { category: "livestock", label: "Livestock" },
  { category: "water", label: "Water" },
  { category: "facilities", label: "Facilities" },
  { category: "welcome", label: "Walker welcome" },
  { category: "other", label: "Other" },
];

export function FieldNotePrompt({
  checkInId,
  businessLocationId,
  trailId,
  onSaved,
  onSkip,
}: FieldNotePromptProps) {
  const [selected, setSelected] = useState<FieldNoteCategory | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSave = Boolean(selected) && !saving && !saved;

  const helperText = useMemo(() => {
    if (!selected) return "One tap is enough. Add detail only if it helps.";
    return `${labelForFieldNoteCategory(selected)} for the next walker.`;
  }, [selected]);

  async function handleSave() {
    if (!selected || saving || saved) return;

    setSaving(true);
    setError(null);

    try {
      await createFieldNote({
        checkInId,
        businessLocationId,
        trailId,
        category: selected,
        message,
        severity:
          selected === "fallen_tree" || selected === "bridge_stile_gate"
            ? "watch"
            : "info",
      });

      setSaved(true);
      onSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save note.");
    } finally {
      setSaving(false);
    }
  }

  if (saved) {
    return (
      <Card style={styles.card}>
        <AppText variant="heading">Field Note added.</AppText>
        <AppText muted>
          Thanks. You have left the walk a little better informed for the next
          person.
        </AppText>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <AppText variant="heading">Anything useful for the next walker?</AppText>
        <AppText muted>{helperText}</AppText>
      </View>

      <View style={styles.chips}>
        {quickNotes.map((note) => (
          <FilterChip
            key={note.category}
            label={note.label}
            active={selected === note.category}
            onPress={() => setSelected(note.category)}
          />
        ))}
      </View>

      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Optional detail, e.g. ankle-deep by the gate."
        placeholderTextColor={theme.colors.textMuted}
        multiline
        maxLength={180}
        style={styles.input}
      />

      {error ? <AppText style={styles.error}>{error}</AppText> : null}

      <PrimaryButton onPress={handleSave} disabled={!canSave}>
        {saving ? "Adding note…" : "Add Field Note"}
      </PrimaryButton>

      {onSkip ? (
        <Pressable onPress={onSkip} style={styles.skip}>
          <AppText variant="label" muted>
            Skip for now
          </AppText>
        </Pressable>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing.md,
  },
  header: {
    gap: theme.spacing.xs,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  input: {
    minHeight: 84,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    padding: theme.spacing.md,
    textAlignVertical: "top",
  },
  skip: {
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  error: {
    color: theme.colors.error,
  },
});
