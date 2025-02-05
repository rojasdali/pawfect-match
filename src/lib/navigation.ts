import { ROUTES } from "@/config/routes";

export function navigateWithSearchParams(
  searchParams: URLSearchParams,
  defaultPath: string = ROUTES.HOME
) {
  const hasSearchParams = searchParams.toString().length > 0;
  return hasSearchParams
    ? `${ROUTES.SEARCH.DOGS}?${searchParams.toString()}`
    : defaultPath;
}
