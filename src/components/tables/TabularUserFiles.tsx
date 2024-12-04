import * as React from "react";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import {
  Paper,
  TableCell,
  TableFooter,
  TableContainer,
  Table,
  TableBody,
  TableHead,
} from "@material-ui/core";
import { useState, useEffect } from "react";
import { TabularData } from "../../apis/DataFrameFile";
import TablePaginationComponent from "./TablePaginationComponent";

export default function CustomPaginationTable(props: {
  userFileContentTable: TabularData[];
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [fileRows, setFileRows] = useState(props.userFileContentTable);
  const [fileColumns, setFileColumns] = useState<string[]>(
    Object.keys(props.userFileContentTable[0])
  );

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - fileRows.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer id="user-file__table__container" component={Paper}>
      <Table
        // sx={{ minWidth: 500 }}
        aria-label="custom pagination table"
        component={"table"}
      >
        <TableHead>
          <TableRow>
            {fileColumns.map((col, index) => {
              return (
                <TableCell key={index} className="user-file__table__content">
                  {col}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody className="user-file__table__content">
          {(rowsPerPage > 0
            ? fileRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : fileRows
          ).map((row, index) => (
            <TableRow key={index}>
              {fileColumns.map((col, index) => {
                return (
                  <TableCell
                    key={index}
                    className="user-file__table__content"
                    component="th"
                    scope="row"
                  >
                    {row[col]}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              className="user-file__table__pagination"
              rowsPerPageOptions={[5, 10, 15]}
              colSpan={3}
              count={fileRows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  "aria-label": "rows per page",
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationComponent}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
