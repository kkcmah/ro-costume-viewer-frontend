import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import PublicIcon from "@mui/icons-material/Public";
import Typography from "@mui/material/Typography";
import { CostumeSet } from "../../types";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { StateContext } from "../../state/state";

interface CostumeSetCardProps {
  costumeSet: CostumeSet;
  toggleLikeSet: (costumeSetId: string) => Promise<void>;
  // from profile my sets
  isMySet?: boolean;
}

const CostumeSetCard = ({
  costumeSet,
  toggleLikeSet,
  isMySet,
}: CostumeSetCardProps) => {
  const [state] = useContext(StateContext);

  const numOfCostumesToShow = 12;

  // truncate the description and suffix it with ... if its too long
  const descToShow = (desc: string): string => {
    const maxLength = 150;
    if (desc.length > maxLength) {
      return desc.slice(0, maxLength) + "...";
    }
    return desc;
  };

  const handleDelete = () => {
    console.log("del", costumeSet);
  };

  const temp = [3, 234, 52, 35, 2, 3, 12, 123, 123, 124, 124, 124, 124];
  //costumeSet.costumes.

  //costumeSet.description
  const desc =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vulputate nunc purus, ut porta morbi.m ipsum dolor sit amet, consectetur adipiscing elit. Nullam vulputate nunc purus, ";

  return (
    <Card>
      <CardHeader
        title={costumeSet.name}
        subheader={`created by: ${costumeSet.owner.username}`}
        action={
          isMySet && (
            <PublicIcon color={costumeSet.isPublic ? "primary" : "disabled"} />
          )
        }
      />
      <CardContent>
        <Grid
          container
          mb={1}
          spacing={{ xs: 1 }}
          columns={{ xs: 6, sm: 8, md: 12 }}
        >
          {temp.slice(0, numOfCostumesToShow).map((cos, ind) => (
            <Grid item xs={2} sm={2} md={2} key={ind}>
              <Typography
                m="auto"
                component="div"
                className="costume costume-18740"
              ></Typography>
            </Grid>
          ))}
        </Grid>
        {temp.length > numOfCostumesToShow && (
          <Typography variant="caption">And more...</Typography>
        )}
        <Typography variant="body1">{descToShow(desc)}</Typography>
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
        {isMySet && (
          <Typography mr="auto">
            <IconButton component={Link} to={`/sets/edit/${costumeSet.id}`}>
              <EditIcon color="primary" />
            </IconButton>
            <IconButton onClick={handleDelete}>
              <DeleteIcon color="error" />
            </IconButton>
          </Typography>
        )}
        <Button size="small" component={Link} to={`/sets/${costumeSet.id}`}>
          Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default CostumeSetCard;
