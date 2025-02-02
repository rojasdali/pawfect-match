import { useEffect, useState } from "react";

type Breakpoint = "base" | "sm" | "md" | "lg" | "xl" | "2xl";

const breakpoints = {
  base: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("base");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const newBreakpoint = (Object.entries(breakpoints)
        .reverse()
        .find(([_, value]) => width >= value)?.[0] ?? "base") as Breakpoint;

      setBreakpoint(newBreakpoint);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
}
