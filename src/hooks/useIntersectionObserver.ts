import { useEffect, RefObject } from "react";

interface UseIntersectionObserverProps {
  target: RefObject<Element>;
  onIntersect: () => void;
  enabled?: boolean;
  rootMargin?: string;
  threshold?: number;
}

export function useIntersectionObserver({
  target,
  onIntersect,
  enabled = true,
  rootMargin = "100px",
  threshold = 0.1,
}: UseIntersectionObserverProps) {
  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting) {
          onIntersect();
        }
      },
      { threshold, rootMargin }
    );

    const element = target.current;
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [target, enabled, rootMargin, threshold, onIntersect]);
}
