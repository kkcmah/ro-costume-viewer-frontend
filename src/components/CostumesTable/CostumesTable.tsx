import { ChangeEvent, useContext, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Costume } from "../../types";
import CostumePreviewDialog from "../CostumePreviewDialog/CostumePreviewDialog";
import { StateContext } from "../../state/state";
import { setFavCostumes } from "../../state/reducer";
import costumesService from "../../services/costumesService";
import AlertNotification from "../AlertNotification/AlertNotification";
import { formatErrorAsString } from "../../services/helpersService";
import useAlertNotification from "../AlertNotification/useAlertNotification";
import "../../spritesheet/spritesheet.css";

interface CostumesTableProps {
  costumes: Costume[];
  page: number;
  onPageChange: (newPage: number) => void;
  rowsPerPage: number;
  onChangeRowsPerPage: (newRowsPer: number) => void;
  count: number;
  rowsPerPageOptions: number[];
  // creating set related props
  isCreatingSet?: boolean;
  handleCosCheckChange?: (costumeChanged: Costume) => void;
  costumesInSet?: Costume[];
}

const CostumesTable = ({
  costumes,
  page,
  onPageChange,
  rowsPerPage,
  onChangeRowsPerPage,
  count,
  rowsPerPageOptions,
  isCreatingSet = false,
  handleCosCheckChange = undefined,
  costumesInSet = [],
}: CostumesTableProps) => {
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [curCosPreview, setCurCosPreview] = useState<Costume>();
  const { setErrorMsg, ...notif } = useAlertNotification();
  const [state, dispatch] = useContext(StateContext);
  const [loadingFavClick, setLoadingFavClick] = useState<boolean>(false);

  const openPreview = (costume: Costume) => {
    setCurCosPreview(costume);
    setPreviewOpen(true);
  };

  const closePreview = () => {
    setPreviewOpen(false);
  };

  const toggleFavCostume = async (costumeId: string) => {
    if (!state.user) return;
    if (loadingFavClick) return;
    setLoadingFavClick(true);
    try {
      if (state.user.favCostumes.includes(costumeId)) {
        const favCostumes = await costumesService.unfavorite(costumeId);
        dispatch(setFavCostumes(favCostumes));
      } else {
        const favCostumes = await costumesService.favorite(costumeId);
        dispatch(setFavCostumes(favCostumes));
      }
    } catch (error) {
      setErrorMsg(formatErrorAsString(error));
    } finally {
      setLoadingFavClick(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeRowsPerPage(+event.target.value);
  };

  const isChecked = (costumeId: string) => {
    for (const costume of costumesInSet) {
      if (costume.id === costumeId) {
        return true;
      }
    }
    return false;
  };

  if (costumes.length === 0) {
    return <div>No costumes found. :(</div>;
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <AlertNotification {...notif}></AlertNotification>
      <TableContainer>
        <Table aria-label="costumes table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>id</TableCell>
              <TableCell>Slots</TableCell>
              <TableCell>Tags</TableCell>
              {/* empty table cell header for actions so that the divider is fullwidth */}
              {state.user && <TableCell></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {costumes.map((cos) => {
              return (
                <TableRow hover key={cos.id}>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      {isCreatingSet && handleCosCheckChange && (
                        <Checkbox
                          checked={isChecked(cos.id)}
                          onChange={() => handleCosCheckChange(cos)}
                        />
                      )}
                      <Box mr={1} className="costume costume-18740"></Box>
                      <div>{cos.name}</div>
                      {cos.previewUrl && (
                        <>
                          <Box
                            sx={{
                              display: { xs: "none", md: "inline" },
                            }}
                          >
                            <Button
                              size="small"
                              color="primary"
                              variant="outlined"
                              onClick={() => openPreview(cos)}
                            >
                              Preview
                            </Button>
                          </Box>
                          <Box
                            sx={{
                              display: { xs: "inline", md: "none" },
                            }}
                          >
                            <IconButton
                              color="primary"
                              aria-label="show preview"
                              onClick={() => openPreview(cos)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Box>
                        </>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{cos.itemId}</TableCell>
                  <TableCell>{cos.equipSlots}</TableCell>
                  <TableCell>
                    {cos.costumeTags.map((tag) => tag.name).join(" ")}
                  </TableCell>
                  {state.user && (
                    <TableCell>
                      <IconButton
                        color={
                          state.user.favCostumes.includes(cos.id)
                            ? "error"
                            : "default"
                        }
                        aria-label="toggle favorite"
                        onClick={() => void toggleFavCostume(cos.id)}
                      >
                        <FavoriteIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <CostumePreviewDialog
        previewOpen={previewOpen}
        closePreview={closePreview}
        curCosPreview={curCosPreview}
      ></CostumePreviewDialog>
    </Paper>
  );
};

export default CostumesTable;
