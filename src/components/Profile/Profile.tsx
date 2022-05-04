import { useContext } from "react";
import { StateContext } from "../../state/state";

const Profile = () => {
  const [state] = useContext(StateContext);

  if (!state.user) {
    return <h2>There is no profile to view. Try signing up or logging in.</h2>;
  }
  return <div>Profile page</div>;
};

export default Profile;
