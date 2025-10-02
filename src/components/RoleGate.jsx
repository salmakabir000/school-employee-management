// RoleGate.jsx
import { useAuth } from "../context/AuthContext";

export default function RoleGate({ role, children }) {
  const { user } = useAuth();

  // if user not logged in or doesn't match required role → hide content
  if (!user || user.role !== role) {
    return null;
  }

  // otherwise, render the restricted content
  return <>{children}</>;
}
