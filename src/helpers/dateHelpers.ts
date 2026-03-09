/**
 * Formats a timestamp into a human-readable date string.
 * Format: "Month Day, Year" (e.g., "March 9, 2026")
 */
export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};
