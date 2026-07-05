import { StyleSheet, TextInput, TextInputProps } from "react-native";
import { theme } from "../theme";

type FormFieldProps = TextInputProps;

export function FormField({ style, ...props }: FormFieldProps) {
  return (
    <TextInput
      placeholderTextColor={theme.colors.textMuted}
      style={[styles.input, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    padding: theme.spacing.md,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    fontSize: 18,
    color: theme.colors.text,
  },
});
