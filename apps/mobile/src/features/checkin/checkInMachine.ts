import type { CheckInResolution } from "../../services/checkin";

/**
 * The check-in journey as an explicit state machine.
 *
 *   idle → resolving → ready → recording → recorded
 *                    ↘ already_visited
 *                    ↘ not_recognised
 *
 * The reducer is pure: services are called from useCheckInJourney and
 * their results arrive here as events. Illegal transitions are ignored
 * rather than thrown — a late RESOLUTION arriving after RESET is noise,
 * not a bug.
 */

export type ReadyResolution = Extract<CheckInResolution, { outcome: "ready" }>;
type NotRecognised = Extract<CheckInResolution, { outcome: "not_recognised" }>;

export type CheckInState =
  | { status: "idle" }
  | { status: "resolving" }
  | { status: "ready"; resolution: ReadyResolution; recordError?: string }
  | { status: "recording"; resolution: ReadyResolution }
  | {
      status: "recorded";
      placeName: string;
      businessName: string;
      stampTitle?: string;
    }
  | {
      status: "already_visited";
      placeName: string;
      businessName: string;
      lastVisitedAt: string;
    }
  | { status: "not_recognised"; reason: NotRecognised["reason"] };

export type CheckInEvent =
  | { type: "CODE_SUBMITTED" }
  | { type: "RESOLUTION_RECEIVED"; resolution: CheckInResolution }
  | { type: "CONFIRMED" }
  | { type: "VISIT_RECORDED" }
  | {
      type: "VISIT_ALREADY_RECORDED";
      placeName?: string;
      businessName?: string;
      lastVisitedAt: string;
    }
  | { type: "RECORDING_FAILED"; reason: string }
  | { type: "RESET" };

export const initialCheckInState: CheckInState = { status: "idle" };

export function checkInReducer(
  state: CheckInState,
  event: CheckInEvent,
): CheckInState {
  switch (event.type) {
    case "CODE_SUBMITTED":
      return state.status === "idle" ? { status: "resolving" } : state;

    case "RESOLUTION_RECEIVED": {
      if (state.status !== "resolving") return state;

      const { resolution } = event;

      switch (resolution.outcome) {
        case "ready":
          return { status: "ready", resolution };
        case "already_visited":
          return {
            status: "already_visited",
            placeName: resolution.placeName,
            businessName: resolution.businessName,
            lastVisitedAt: resolution.lastVisitedAt,
          };
        case "not_recognised":
          return { status: "not_recognised", reason: resolution.reason };
      }
    }

    case "CONFIRMED":
      return state.status === "ready"
        ? { status: "recording", resolution: state.resolution }
        : state;

    case "VISIT_RECORDED":
      return state.status === "recording"
        ? {
            status: "recorded",
            placeName: state.resolution.placeName,
            businessName: state.resolution.businessName,
            stampTitle: state.resolution.stamp?.title,
          }
        : state;

    case "VISIT_ALREADY_RECORDED":
      // The write-side guard fired: someone beat this tap to it.
      return state.status === "recording"
        ? {
            status: "already_visited",
            placeName: event.placeName ?? state.resolution.placeName,
            businessName: event.businessName ?? state.resolution.businessName,
            lastVisitedAt: event.lastVisitedAt,
          }
        : state;

    case "RECORDING_FAILED":
      // A genuine failure returns the walker to ready with the offer intact.
      return state.status === "recording"
        ? {
            status: "ready",
            resolution: state.resolution,
            recordError: event.reason,
          }
        : state;

    case "RESET":
      return initialCheckInState;
  }
}
