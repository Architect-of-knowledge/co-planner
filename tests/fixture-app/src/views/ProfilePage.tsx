import { useUser } from "../state/user";
export function ProfilePage() { return useUser((s) => s.name); }
