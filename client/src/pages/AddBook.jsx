import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./AddBook.css";
import { useEffect, useState } from "react";
import {
  Card,
  ImageListItemBar,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import axios from "axios";
import { memo } from "react";
import { useMemo } from "react";

const StyledTextField = styled(TextField)(() => ({
  width: "100%",
}));

const AddBook = () => {
  const [value, setValue] = useState(dayjs());
  const [book_title, setBook_title] = useState("");
  const [book_author, setBook_author] = useState("");
  const [ctrl_number, setCtrl_number] = useState("");
  const [course, setCourse] = useState("BSED");
  const [book_number, setBook_number] = useState("");
  const [bookImg, setBookImg] = useState("");

  const [originalControlNumber, setOriginalControlNumber] = useState("");

  // const [editBook, setEditBook] = useState(null);

  const { state } = useLocation();

  let editBook;

  if (state) {
    const { editBookParam } = state;
    editBook = editBookParam;
  }

  useEffect(() => {
    if (editBook) {
      const { publishYear } = editBook;
      setValue(dayjs().year(publishYear));
      setBook_number(editBook.bookNumber);
      setBook_title(editBook.bookTitle);
      setBook_author(editBook.bookAuthor);
      setCourse(editBook.course);
      const formatted = `${editBook.course}-${publishYear}-${editBook.bookNumber}`;
      setOriginalControlNumber(formatted);
    }
  }, [editBook]);

  // console.log("from addbook: ", editBook);

  useEffect(() => {
    const formatted = `${course}-${value?.$y}-${book_number}`;
    setCtrl_number(formatted);
  }, [course, book_number, value]);

  useEffect(() => {
    if (editBook) return;
    const getLastBook = async () => {
      try {
        const res = await axios.get("http://localhost:8800/get-lastbooknumber");
        if (res.data[0].latest_book !== null) {
          const stringFormat = +res.data[0].latest_book + 1;
          setBook_number(stringFormat.toString().padStart(4, "0"));
        } else {
          setBook_number("0001");
        }
        console.log("lastbook is", typeof res.data[0].latest_book);
      } catch (err) {
        console.log(err);
      }
    };

    getLastBook();
  }, [editBook]);

  const courses = [
    {
      value: "BSED",
      label: "BSED",
    },
    {
      value: "BEED",
      label: "BEED",
    },
    {
      value: "BECED",
      label: "BECED",
    },
    {
      value: "BSF",
      label: "BSF",
    },
    {
      value: "BST",
      label: "BST",
    },
    {
      value: "BSIT",
      label: "BSIT",
    },
    {
      value: "BSHM",
      label: "BSHM",
    },
    {
      value: "BSA-CROPSCI",
      label: "BSA-CROPSCI",
    },
    {
      value: "BSA-ANSCI",
      label: "BSA-ANSCI",
    },
    {
      value: "BSABE",
      label: "BSABE",
    },
    {
      value: "BSME",
      label: "BSME",
    },
    {
      value: "BSEE",
      label: "BSEE",
    },
    {
      value: "BSAS",
      label: "BSAS",
    },
    {
      value: "AB-EL",
      label: "AB-EL",
    },
    {
      value: "BSCRIM",
      label: "BSCRIM",
    },
    {
      value: "ABSOCSCI",
      label: "ABSOCSCI",
    },
    {
      value: "MSAS",
      label: "MSAS",
    },
    {
      value: "MS-AGEXT",
      label: "MS-AGEXT",
    },
    {
      value: "MSA-CROPSCI",
      label: "MSA-CROPSCI",
    },
    {
      value: "MSA-HORTI",
      label: "MSA-HORTI",
    },
    {
      value: "MPA-HRM",
      label: "MPA-HRM",
    },
    {
      value: "MAEM-VP",
      label: "MAEM-VP",
    },
    {
      value: "MAED",
      label: "MAED",
    },
    {
      value: "PHD-EM",
      label: "PHD-EM",
    },
    {
      value: "PHD-AGRI",
      label: "PHD-AGRI",
    },
  ];

  const [book, setBook] = useState(null);

  useEffect(() => {
    setBook({
      book_title,
      book_author,
      publish_year: value.$y,
      book_number,
      course,
      ctrl_number,
    });
  }, [
    value,
    book_title,
    book_author,
    ctrl_number,
    book_number,
    course,
    bookImg,
  ]);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };
    setBookImg(img);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const imageData = new FormData();
    // console.log(bookImg.data);
    imageData.append("img", bookImg.data);
    imageData.append("filename", ctrl_number);

    try {
      if (!editBook) {
        await axios.post("http://localhost:8800/add", book);
        console.log("handle add is run");
        const res = await axios.post("http://localhost:8800/upload", imageData);
        console.log("test upload is run:", res);
      } else {
        const res = await axios.put("http://localhost:8800/edit", book);
        console.log("edit is run");
        console.log(res.data);
        const ctrlToReplace = { ctrl_number, originalControlNumber };
        if (bookImg === "") {
          const resBookImageUpdate = await axios.put(
            "http://localhost:8800/rename-file-image",
            ctrlToReplace
          );
          console.log("reaname file iamge is run: ");
        } else {
          console.log("ctrlnumber to delete: ", originalControlNumber);
          await axios.delete(
            "http://localhost:8800/delete-img/" +
              ctrl_number +
              "/" +
              originalControlNumber
          );
          console.log("delete img is run");
          const res = await axios.post(
            "http://localhost:8800/upload",
            imageData
          );
          console.log("test upload is run:", res);
        }
      }
      // window.location.reload();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="AddBook">
      <Card
        sx={{
          height: 480,
          width: "fit-content",
          mx: "auto",
          py: 5,
          borderRadius: 2.5,
          overflow: "auto",
        }}
      >
        <Typography sx={{ margin: 1 }} variant="h4">
          {editBook ? "EDIT BOOK" : "ADD NEW BOOK"}
        </Typography>
        <form onSubmit={handleAdd} encType="multipart/form-data">
          <div className="input-container">
            <StyledTextField
              required
              id="outlined-basic"
              value={book_title}
              onChange={(e) => setBook_title(e.target.value)}
              label="Book Title"
              variant="outlined"
            />
          </div>
          <div className="input-container">
            <StyledTextField
              required
              id="outlined-basic"
              value={book_author}
              onChange={(e) => setBook_author(e.target.value)}
              label="Book Author"
              variant="outlined"
            />
          </div>

          <div className="input-container">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{ width: 200 }}
                views={["year"]}
                label="Year"
                value={value}
                onChange={(newValue) => setValue(newValue)}
                renderInput={(params) => (
                  <StyledTextField required {...params} helperText={null} />
                )}
              />
            </LocalizationProvider>
          </div>
          <div className="input-container ctrl">
            <StyledTextField
              required
              id="outlined-select-currency"
              select
              label="Select Course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            >
              {courses.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </StyledTextField>
            <StyledTextField
              required
              disabled
              id="outlined-basic"
              value={book_number}
              onChange={(e) =>
                e.target.value.length <= 3 && setBook_number(e.target.value)
              }
              label="Book Number"
              variant="outlined"
              placeholder="000"
              inputProps={{
                maxLength: 3,
              }}
            />
          </div>
          <div className="input-container">
            <StyledTextField
              disabled
              id="outlined-basic"
              value={ctrl_number}
              // onChange={(e) => setBook_title(e.target.value)}
              label="Control Number"
              variant="outlined"
            />
          </div>
          <div className="input-container">
            <StyledTextField
              required={!editBook}
              type="file"
              name="img"
              id="outlined-basic"
              onChange={handleFileChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{ accept: "image/*" }}
              label="Upload File"
              variant="outlined"
            />
          </div>
          {bookImg.preview && (
            <div className="input-container">
              <img src={bookImg.preview} alt="" height="150px" />
            </div>
          )}
          <div className="input-container">
            <Button
              sx={{ width: 260, backgroundColor: "green" }}
              variant="contained"
              type="submit"
            >
              {editBook ? "Edit Book" : "Add new Book"}
            </Button>
            <Button
              onClick={() => navigate("/")}
              sx={{ margin: 1, width: 260, backgroundColor: "green" }}
              variant="contained"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddBook;
