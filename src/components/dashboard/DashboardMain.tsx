"use client";

import { useState, useEffect, useRef } from "react";

export default function DashboardMain({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    // Read initial state
    if (!initialized.current) {
      const stored = localStorage.getItem("sidebar-collapsed");
      if (stored === "true") requestAnimationFrame(() => setCollapsed(true));
      initialized.current = true;
    }

    // Listen for sidebar toggle events
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setCollapsed(detail);
    };
    window.addEventListener("sidebar-toggle", handler);
    return () => window.removeEventListener("sidebar-toggle", handler);
  }, []);

  return (
    <main
      className="transition-[margin-left] duration-300 ease-in-out"
      style={{ marginLeft: undefined }}
    >
      <div
        className={`
          ${collapsed ? "lg:ml-17" : "lg:ml-60"}
          transition-[margin-left] duration-300 ease-in-out
        `}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
          {children}
        </div>
      </div>
    </main>
  );
}
