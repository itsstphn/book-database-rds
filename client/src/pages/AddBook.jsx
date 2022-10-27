import dayjs, { Dayjs } from "dayjs";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./AddBook.css";
import { useState } from "react";
import { TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import styled from "@emotion/styled";
import Button from "@mui/material/Button";

const StyledTextField = styled(TextField)(() => ({
  width: 260,
}));

const AddBook = () => {
  const [value, setValue] = useState(dayjs());

  const navigate = useNavigate();

  console.log(value?.$y);

  return (
    <div className="AddBook">
      <Typography sx={{ margin: 1 }} variant="h3">
        ADD NEW BOOK
      </Typography>
      <form>
        <div className="input-container">
          <StyledTextField
            id="outlined-basic"
            label="Book Title"
            variant="outlined"
          />
        </div>
        <div className="input-container">
          <StyledTextField
            id="outlined-basic"
            label="Book Author"
            variant="outlined"
          />
        </div>

        <div className="input-container">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={["year"]}
              label="Year"
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
              }}
              renderInput={(params) => (
                <TextField {...params} helperText={null} />
              )}
            />
          </LocalizationProvider>
        </div>
        <div className="input-container">
          <StyledTextField
            id="outlined-basic"
            label="Control Number"
            variant="outlined"
          />
        </div>
        <div className="input-container">
          <Button
            sx={{ width: 260, backgroundColor: "green" }}
            variant="contained"
          >
            Add new Book
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
    </div>
  );
};

export default AddBook;
