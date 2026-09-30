// Leave 16px gutters on phones and 32px on larger screens.
export const BROWSER_PAGE_MAX_WIDTH = {
  xs: "calc(100% - 32px)",
  md: "calc(100% - 64px)",
} as const;

export const PORTAL_CONTENT_MAX_WIDTH = {
  xs: "90%",
  sm: "90%",
  md: "85%",
  lg: "75%",
  xl: "65%",
} as const;
