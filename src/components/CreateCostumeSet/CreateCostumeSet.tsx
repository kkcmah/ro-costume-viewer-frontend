import { useContext } from "react";
import { StateContext } from "../../state/state";

const CreateCostumeSet = () => {
  const [state] = useContext(StateContext);
  if (!state.user) return <h2>You must be logged in to create a set.</h2>;
  return <div>Create costume set...</div>;
};

export default CreateCostumeSet;
