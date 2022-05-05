import "./Logout.css";
import { useTitle } from "../../hooks/useTitle";

interface LogoutProps {
  title: string;
}

const Logout = ({ title }: LogoutProps) => {
  useTitle(title);
  return (
    <div className="logout-msg">
      <h2>You have logged out</h2>
    </div>
  );
};

export default Logout;
