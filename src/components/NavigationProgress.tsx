"use client";

import { useEffect, useState, useTransition, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * A thin animated progress bar displayed at the very top of the viewport
 * whenever a Next.js route change is in progress.
 *
 * It works by detecting pathname changes — when the pathname changes, the bar
 * animates to 100% and fades out.
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [progress, setProgress] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const prevPathRef = useRef(pathname);

  // Detect clicks on internal links to start the progress bar immediately
  const handleClick = useCallback(
    (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (
        !href ||
        href.startsWith("http") ||
        href.startsWith("#") ||
        target.target === "_blank" ||
        e.metaKey ||
        e.ctrlKey
      )
        return;

      // Only trigger for dashboard internal links
      if (href === pathname) return;

      startTransition(() => {
        setIsNavigating(true);
        setProgress(15);
      });
    },
    [pathname, startTransition]
  );

  useEffect(() => {
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [handleClick]);

  // When pathname changes, complete the progress bar
  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      prevPathRef.current = pathname;

      if (isNavigating) {
        // Animate to 100% then fade out
        const raf = requestAnimationFrame(() => setProgress(100));
        const timer = setTimeout(() => {
          setIsNavigating(false);
          setProgress(0);
        }, 400);
        return () => {
          cancelAnimationFrame(raf);
          clearTimeout(timer);
        };
      }
    }
  }, [pathname, isNavigating]);

  // Slowly increment while navigating to give feeling of progress
  useEffect(() => {
    if (!isNavigating || progress >= 90) return;

    const timer = setTimeout(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        // Slow down as we approach 90
        const increment = Math.max(1, (90 - prev) * 0.1);
        return Math.min(prev + increment, 90);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [isNavigating, progress]);

  if (!isNavigating && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999999] h-[3px] pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-violet-500 shadow-[0_0_10px_rgba(124,58,237,0.5)] rounded-r-full"
        style={{
          width: `${progress}%`,
          transition:
            progress === 100
              ? "width 200ms ease-out, opacity 300ms ease-out 200ms"
              : progress <= 15
                ? "width 100ms ease-out"
                : "width 500ms ease-out",
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
