import { useEffect, useState } from "react";
import { subscribe } from "@/lib/store";

// Forces re-render when the local store changes.
export function useStoreSubscription() {
  const [, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick((t) => t + 1)), []);
}
