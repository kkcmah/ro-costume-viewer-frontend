import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import { ChangeEvent, useState } from "react";
import { Costume } from "../../types";
import "./CostumePreviewDialog.css";

interface PreviewDialogProps {
  previewOpen: boolean;
  closePreview: () => void;
  curCosPreview: Costume | undefined;
}

const CostumePreviewDialog = ({
  previewOpen,
  closePreview,
  curCosPreview,
}: PreviewDialogProps) => {
  const [loop, setLoop] = useState<boolean>(true);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLoop(event.target.checked);
  };

  return (
    <Dialog
      fullWidth
      open={previewOpen}
      onClose={closePreview}
      aria-labelledby="preview-title"
    >
      <DialogTitle id="preview-title">
        Previewing {curCosPreview?.name}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <video id="preview-video" controls loop={loop}>
              <source src={curCosPreview?.previewUrl} type="video/mp4" />
              Sorry, your browser does not support embedded videos.
            </video>
          </Grid>
          <Grid item md={4}>
            <Stack
              direction={{ xs: "row", md: "column" }}
              justifyContent="space-evenly"
              alignItems={{ xs: "center", md: "initial" }}
              spacing={5}
            >
              <div className="icon-container">
                <div>Icon:</div>
                <div className="costume costume-18740"></div>
              </div>

              <div>Id: {curCosPreview?.itemId}</div>
              <div>Slots: {curCosPreview?.equipSlots}</div>
              <div>
                Tags:{" "}
                {curCosPreview?.costumeTags.map((tag) => tag.name).join(" ")}
              </div>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <div id="loop-switch">
          <Switch checked={loop} onChange={handleChange} /> Loop Video
        </div>
        <Button onClick={closePreview}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CostumePreviewDialog;
