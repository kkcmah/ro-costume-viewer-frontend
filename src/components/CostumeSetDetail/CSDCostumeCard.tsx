import {
  useState,
  SyntheticEvent,
  ChangeEvent,
  useEffect,
  useRef,
} from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { Costume } from "../../types";
import "./CSDCostumeCard.css";

interface CSDCostumeCardProps {
  costume: Costume;
}

const CSDCostumeCard = ({ costume }: CSDCostumeCardProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [loop, setLoop] = useState<boolean>(true);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    video.current?.load();
  }, [previewUrl]);

  const handleAccordianOpen = (event: SyntheticEvent, isExpanded: boolean) => {
    if (isExpanded && !previewUrl) {
      setPreviewUrl(costume.previewUrl);
    }
  };

  const handleLoopChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLoop(event.target.checked);
  };

  return (
    <Card>
      <CardHeader
        avatar={<Typography className="costume costume-18740"></Typography>}
        title={costume.name}
        subheader={`(itemId: ${costume.itemId})`}
      />
      <CardContent>
        <Typography variant="body1">
          Slot(s): {costume.equipSlots.join(" ")}
        </Typography>
        <Typography variant="body2">
          Tags: {costume.costumeTags.map((tag) => tag.name).join(" ")}
        </Typography>
        {costume.previewUrl && (
          <Accordion onChange={handleAccordianOpen}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`cos-${costume.itemId}-content`}
              id={`cos-${costume.itemId}-header`}
            >
              <Typography>Show preview</Typography>
            </AccordionSummary>
            {previewUrl && (
              <AccordionDetails>
                <Typography>
                  <video
                    ref={video}
                    className="CSD-preview-video"
                    controls
                    loop={loop}
                  >
                    <source src={previewUrl} type="video/mp4" />
                    Sorry, your browser does not support embedded videos.
                  </video>
                </Typography>
                <Typography textAlign="center">
                  <Switch
                    color="info"
                    checked={loop}
                    onChange={handleLoopChange}
                  />{" "}
                  Loop Video
                </Typography>
              </AccordionDetails>
            )}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};

export default CSDCostumeCard;
