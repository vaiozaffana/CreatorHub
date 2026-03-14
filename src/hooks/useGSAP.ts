"use client";

import { useRef, useEffect } from "react";

type GSAPCallback = (gsap: typeof import("gsap").default) => void;

export function useGSAP(
  ref: React.RefObject<HTMLElement | null>,
  callback: GSAPCallback,
  deps: React.DependencyList = []
) {
  const gsapRef = useRef<typeof import("gsap").default | null>(null);

  useEffect(() => {
    let cleanup: (() => void) | void;

    import("gsap").then((mod) => {
      gsapRef.current = mod.default;
      if (ref.current) {
        cleanup = callback(mod.default) as void;
      }
    });

    return () => {
      if (typeof cleanup === "function") cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return gsapRef;
}
