import { useReducer } from "react";
import {
  performCheckIn,
  resolveCheckIn,
  type CheckInMethod,
} from "../../services/checkin";
import {
  checkInReducer,
  initialCheckInState,
  type CheckInState,
} from "./checkInMachine";

/**
 * Side effects live here; the machine stays pure. Components receive the
 * current state and three intentions — nothing else.
 */
export function useCheckInJourney(): {
  state: CheckInState;
  submitCode: (code: string, method: CheckInMethod) => Promise<void>;
  confirmVisit: () => Promise<void>;
  reset: () => void;
} {
  const [state, dispatch] = useReducer(checkInReducer, initialCheckInState);

  async function submitCode(code: string, method: CheckInMethod) {
    dispatch({ type: "CODE_SUBMITTED", method });

    const resolution = await resolveCheckIn(code);

    dispatch({ type: "RESOLUTION_RECEIVED", resolution });
  }

  async function confirmVisit() {
    if (state.status !== "ready") return;

    const { checkInRef } = state.resolution;
    const { method } = state;

    dispatch({ type: "CONFIRMED" });

    const result = await performCheckIn(checkInRef, method);

    switch (result.outcome) {
      case "recorded":
        dispatch({
          type: "VISIT_RECORDED",
          recognitionTitle: result.recognition?.title,
        });
        return;
      case "already_visited":
        dispatch({
          type: "VISIT_ALREADY_RECORDED",
          placeName: result.placeName,
          businessName: result.businessName,
          lastVisitedAt: result.lastVisitedAt,
        });
        return;
      case "failed":
        dispatch({ type: "RECORDING_FAILED", reason: result.reason });
        return;
    }
  }

  function reset() {
    dispatch({ type: "RESET" });
  }

  return { state, submitCode, confirmVisit, reset };
}
