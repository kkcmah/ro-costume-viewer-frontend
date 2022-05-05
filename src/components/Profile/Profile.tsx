import { useContext } from "react";
import { StateContext } from "../../state/state";
import { useTitle } from "../../hooks/useTitle";


interface ProfileProps {
  title: string;
}

const Profile = ({title}: ProfileProps) => {
  useTitle(title);
  const [state] = useContext(StateContext);

  if (!state.user) {
    return <h2>There is no profile to view. Try signing up or logging in.</h2>;
  }
  return <div>Profile page</div>;
};

export default Profile;
