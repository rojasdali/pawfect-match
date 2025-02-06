import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/routes";

const LAST_SEARCH_KEY = "lastSearchState";

export function useSearchStateNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const saveSearchState = () => {
    if (location.pathname.includes("/search")) {
      sessionStorage.setItem(
        LAST_SEARCH_KEY,
        location.pathname + location.search
      );
    }
  };

  const getLastSearchState = () => {
    return sessionStorage.getItem(LAST_SEARCH_KEY);
  };

  const navigatePreservingSearch = (
    to: string,
    options?: {
      replace?: boolean;
      state?: { [key: string]: any };
    }
  ) => {
    saveSearchState();

    const fromSearchPage = location.pathname.includes("/search");
    const state = fromSearchPage
      ? { from: location.pathname + location.search, ...options?.state }
      : options?.state;

    navigate(to, {
      replace: options?.replace,
      state,
    });
  };

  const navigateBack = () => {
    if (location.state?.from?.includes("/search")) {
      navigate(location.state.from, { replace: true });
      return;
    }

    const lastSearch = getLastSearchState();
    if (lastSearch) {
      navigate(lastSearch, { replace: true });
      return;
    }

    navigate(ROUTES.HOME, { replace: true });
  };

  return {
    navigatePreservingSearch,
    navigateBack,
    saveSearchState,
  };
}
