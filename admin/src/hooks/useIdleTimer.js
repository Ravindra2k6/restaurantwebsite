import { useEffect, useRef } from "react";

const ACTIVITY_EVENTS = ["mousedown", "keydown", "scroll", "touchstart"];

/**
 * Calls `onIdle` after `timeoutMs` of no user activity — used to
 * automatically log admins out of an unattended session for security.
 * Default: 30 minutes.
 */
const useIdleTimer = (onIdle, timeoutMs = 30 * 60 * 1000) => {
  const timerRef = useRef(null);

  useEffect(() => {
    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(onIdle, timeoutMs);
    };

    resetTimer();
    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, resetTimer));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [onIdle, timeoutMs]);
};

export default useIdleTimer;
