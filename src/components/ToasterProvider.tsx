"use client";

import { Toaster } from "sonner";
import { useTheme } from "@/components/ThemeProvider";

export function ToasterProvider() {
  const { theme } = useTheme();

  return (
    <Toaster
      position="top-center"
      theme={theme}
      richColors
      closeButton
      offset="24px"
      toastOptions={{
        className: "font-sans",
        duration: 4000,
      }}
    />
  );
}
