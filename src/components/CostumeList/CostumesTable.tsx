import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Costume } from "../../types";
import { ChangeEvent } from "react";

interface CostumesTableProps {
  costumes: Costume[];
  page: number;
  onPageChange: (newPage: number) => void;
  rowsPerPage: number;
  onChangeRowsPerPage: (newRowsPer: number) => void;
  count: number;
  rowsPerPageOptions: number[];
}

const CostumesTable = ({
  costumes,
  page,
  onPageChange,
  rowsPerPage,
  onChangeRowsPerPage,
  count,
  rowsPerPageOptions,
}: CostumesTableProps) => {
  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeRowsPerPage(+event.target.value);
  };

  if (costumes.length === 0) {
    return <div>No costumes found. :(</div>;
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer>
        <Table aria-label="costumes table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>id</TableCell>
              <TableCell>Slots</TableCell>
              <TableCell>Tags</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {costumes.map((cos) => {
              return (
                <TableRow hover key={cos.id}>
                  <TableCell>{cos.name}</TableCell>
                  <TableCell>{cos.itemId}</TableCell>
                  <TableCell>{cos.equipSlots}</TableCell>
                  <TableCell>{cos.costumeTags}</TableCell>
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
    </Paper>
  );
};

export default CostumesTable;
