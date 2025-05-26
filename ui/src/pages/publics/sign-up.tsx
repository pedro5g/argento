import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";

export function SignUp() {
  const navigate = useNavigate();
  const { data, isPending } = useAuth();

  if (data?.userAccount && !isPending) {
    navigate("/dashboard", { replace: true });
  }

  if (isPending) return <p>Loading...</p>;

  return <div>SingUp</div>;
}
