import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Costume } from "../../types";
import CostumePreviewDialog from "../CostumePreviewDialog/CostumePreviewDialog";

interface CostumesToAddListProps {
  costumesInSet: Costume[];
  handleRemove: (costumeIdToRemove: string) => void;
}

const CostumesToAddList = ({
  costumesInSet,
  handleRemove,
}: CostumesToAddListProps) => {
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [curCosPreview, setCurCosPreview] = useState<Costume>();

  const openPreview = (costume: Costume) => {
    setCurCosPreview(costume);
    setPreviewOpen(true);
  };

  const closePreview = () => {
    setPreviewOpen(false);
  };

  return (
    <>
      <Accordion
        sx={{ maxWidth: "600px" }}
        disabled={costumesInSet.length === 0}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="costume-set-list-content"
          id="costume-set-list-header"
        >
          <Typography>
            There will be {costumesInSet.length} costume(s) in set
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {costumesInSet.map((costume) => {
              return (
                <ListItem
                  key={costume.id}
                  secondaryAction={
                    <>
                      {costume.previewUrl && (
                        <IconButton
                          edge="start"
                          aria-label="preview"
                          color="primary"
                          onClick={() => openPreview(costume)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      )}
                      <IconButton
                        edge="end"
                        aria-label="remove"
                        color="error"
                        onClick={() => handleRemove(costume.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemIcon>
                    <Box className="costume costume-18740"></Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={`${costume.name} (itemId: ${costume.itemId})`}
                    secondary={costume.equipSlots.join(" ")}
                  />
                </ListItem>
              );
            })}
          </List>
        </AccordionDetails>
      </Accordion>
      <CostumePreviewDialog
        previewOpen={previewOpen}
        closePreview={closePreview}
        curCosPreview={curCosPreview}
      ></CostumePreviewDialog>
    </>
  );
};

export default CostumesToAddList;
