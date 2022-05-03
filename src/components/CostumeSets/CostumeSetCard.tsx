import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { CostumeSet } from "../../types";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { StateContext } from "../../state/state";

interface CostumeSetCardProps {
  costumeSet: CostumeSet;
  toggleLikeSet: (costumeSetId: string) => Promise<void>;
}

const CostumeSetCard = ({ costumeSet, toggleLikeSet }: CostumeSetCardProps) => {
  const [state] = useContext(StateContext);
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        title={costumeSet.name}
        subheader={`created by: ${costumeSet.owner.username}`}
      />
      <CardContent>
        <Typography variant="body1">{costumeSet.description}</Typography>
      </CardContent>
      <CardActions>
        <IconButton
          disabled={!state.user}
          color={
            state.user?.likedCostumeSets.includes(costumeSet.id)
              ? "error"
              : "default"
          }
          aria-label="toggle like"
          onClick={() => void toggleLikeSet(costumeSet.id)}
        >
          <FavoriteIcon />
        </IconButton>
        <Typography variant="body2" mr={"auto"}>
          {costumeSet.likes}
        </Typography>
        <Button size="small" component={Link} to={`/sets/${costumeSet.id}`}>
          Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default CostumeSetCard;
