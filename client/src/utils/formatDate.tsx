export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const daysLeft = (expiresAt?: string | Date | null) => {
  if (!expiresAt) return null;
  const now = new Date();
  const exp = new Date(expiresAt);
  const diffMs = exp.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const isExpired = (expiresAt?: string | Date | null) => {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() < Date.now();
};


export default formatDate;