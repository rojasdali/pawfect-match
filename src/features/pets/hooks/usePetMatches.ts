import { useMatchesStore } from "@/stores/matches";

export function usePetMatches() {
  const toggleMatch = useMatchesStore((state) => state.addMatch);
  const removeMatch = useMatchesStore((state) => state.removeMatch);
  const isMatch = useMatchesStore((state) => state.isMatch);

  return {
    toggleMatch,
    removeMatch,
    isMatch,
  };
}
