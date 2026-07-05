import { AppText } from "../AppText";

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = "Loading…" }: LoadingStateProps) {
  return <AppText muted>{message}</AppText>;
}
