import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";

export function Dashboard() {
  const navigate = useNavigate();
  const { data, isPending } = useAuth();

  if (!data?.userAccount && !isPending) {
    navigate("/", { replace: true });
  }

  if (isPending) return <p>Loading...</p>;

  return <div>Dashboard</div>;
}
