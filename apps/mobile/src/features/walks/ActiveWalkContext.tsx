import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { finishWalk, getActiveWalk, startWalk } from "../../services/walks";
import type { ActiveWalk } from "../../services/walks";

type ActiveWalkContextValue = {
  activeWalk: ActiveWalk | null;
  isLoading: boolean;
  start: (trailId: string, trailName: string) => Promise<void>;
  finish: () => Promise<void>;
};

const ActiveWalkContext = createContext<ActiveWalkContextValue | undefined>(
  undefined,
);

type ActiveWalkProviderProps = {
  children: ReactNode;
};

export function ActiveWalkProvider({ children }: ActiveWalkProviderProps) {
  const [activeWalk, setActiveWalk] = useState<ActiveWalk | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getActiveWalk()
      .then(setActiveWalk)
      .finally(() => setIsLoading(false));
  }, []);

  async function start(trailId: string, trailName: string) {
    const walk = await startWalk(trailId, trailName);
    setActiveWalk(walk);
  }

  async function finish() {
    await finishWalk();
    setActiveWalk(null);
  }

  return (
    <ActiveWalkContext.Provider
      value={{ activeWalk, isLoading, start, finish }}
    >
      {children}
    </ActiveWalkContext.Provider>
  );
}

export function useActiveWalk() {
  const context = useContext(ActiveWalkContext);

  if (!context) {
    throw new Error("useActiveWalk must be used within ActiveWalkProvider.");
  }

  return context;
}
