import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Backdrop,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  styled,
  Typography,
} from "@mui/material";
import noImage from "../assets/img/no-image.png";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function createData(
  controlNumber,
  bookTitle,
  bookAuthor,
  publishYear,
  course,
  bookNumber
) {
  return {
    controlNumber,
    bookTitle,
    bookAuthor,
    publishYear,
    course,
    bookNumber,
  };
}

export default function DataTable({ books }) {
  const navigate = useNavigate();
  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete?") === true) {
      try {
        console.log(id);
        await axios.delete("http://localhost:8800/books/" + id);
        console.log("delete fired");
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const rows = [
    ...books.map((book) =>
      createData(
        book.ctrl_number,
        book.book_title,
        book.book_author,
        book.publish_year,
        book.course,
        book.book_number
      )
    ),
  ];

  // for Modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setAbstractImage(null);
    setOpen(false);
  };

  // get abstract image file
  const [abstractImage, setAbstractImage] = useState(null);
  const handleAbstractClick = async (ctrlNumber) => {
    handleOpen();
    const imageFile = `http://localhost:8800/${ctrlNumber}.jpg`;

    console.log(imageFile);
    setAbstractImage(imageFile);
  };

  const handleEditClick = (book) => {
    const editBookParam = book;
    navigate("/add-book", { state: { editBookParam } });
  };

  return (
    <TableContainer
      sx={{ px: 2, maxHeight: 400, width: "unset" }}
      component={Paper}
    >
      <Table
        sx={{ minWidth: 650 }}
        // size="small"
        stickyHeader
        aria-label="simple table"
      >
        <TableHead sx={{ fontWeight: "bold" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Control Number</TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="left">
              Book Title
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="left">
              Book Author
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="left">
              Publish Year
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.controlNumber}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                overflow: "auto",
              }}
            >
              <TableCell sx={{ minWidth: 100 }} component="th" scope="row">
                {row.controlNumber}
              </TableCell>
              <TableCell sx={{ maxWidth: 380 }} align="left">
                {row.bookTitle}
              </TableCell>
              <TableCell sx={{ maxWidth: 300 }} align="left">
                {row.bookAuthor}
              </TableCell>
              <TableCell align="left">{row.publishYear}</TableCell>
              <TableCell sx={{ display: "flex", gap: 1 }}>
                <Button
                  title="Delete"
                  onClick={() => handleDeleteClick(row.controlNumber)}
                  // size="small"
                  sx={{ minWidth: 5, p: 0 }}
                >
                  <DeleteForeverIcon
                    sx={{ color: "#424242", "&:hover": { color: "red" } }}
                  ></DeleteForeverIcon>
                </Button>
                <Button
                  onClick={() => handleAbstractClick(row.controlNumber)}
                  sx={{ minWidth: 5, p: 0 }}
                  title="Open Abstract"
                >
                  <OpenInNewIcon
                    sx={{ color: "#424242", "&:hover": { color: "unset" } }}
                  ></OpenInNewIcon>
                </Button>
                <Button
                  onClick={() => handleEditClick(row)}
                  sx={{ minWidth: 5, p: 0 }}
                  title="Open Abstract"
                >
                  <EditIcon
                    sx={{ color: "#424242", "&:hover": { color: "unset" } }}
                  ></EditIcon>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {abstractImage !== null && (
          <Dialog
            BackdropProps={{
              style: { backgroundColor: "black", opacity: 0.5 },
            }}
            onClose={handleClose}
            open={open}
          >
            <DialogContent sx={{ width: 500, p: 0 }}>
              <img
                style={{ height: "100%", width: "100%" }}
                src={abstractImage}
                onError={() => setAbstractImage(noImage)}
                alt=""
              />
            </DialogContent>
          </Dialog>
        )}
      </Table>
    </TableContainer>
  );
}
