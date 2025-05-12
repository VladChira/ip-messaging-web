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

export const loggedInUserID: number = 1;

export function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}
