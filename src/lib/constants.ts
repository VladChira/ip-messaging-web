export const appName: string = "Scylla";

export type ChatAppUser = {
  createdAt: string;
  email: string;
  name: string;
  role: string;
  status: string;
  userId: number;
  username: string;
};

// Get initials for avatar fallback
export function getInitials(name: string): string {
  if (!name) return "?";

  const nameArray = name.split(" ");
  if (nameArray.length >= 2) {
    return `${nameArray[0][0]}${nameArray[1][0]}`.toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
};
