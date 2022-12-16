import { TextField, Typography } from "@mui/material";
import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const StyledTextField = styled(TextField)(() => ({
  width: 320,
  height: 40,
}));

const StyledButton = styled(Button)(() => ({
  width: 180,
}));

const Search = ({ handleSearchClick }) => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  console.log(searchTerm);

  return (
    <Card
      sx={{
        width: "fit-content",
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ display: "flex", flexDirection: "row" }}>
        <form className="search-book">
          <label>
            <div className="input-container">
              <StyledTextField
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              ></StyledTextField>
            </div>
            <div className="buttons">
              <StyledButton
                sx={{
                  // margin: 2,
                  backgroundColor: "green",
                  width: 30,
                }}
                onClick={() => {
                  handleSearchClick(searchTerm);
                  // console.log("hello");
                }}
                variant="contained"
              >
                Search
              </StyledButton>
              <StyledButton
                sx={{ backgroundColor: "green", width: "fit-content" }}
                onClick={() => navigate("/add-book")}
                variant="contained"
              >
                Add new Book
              </StyledButton>
            </div>
          </label>
        </form>
      </CardContent>
    </Card>
  );
};

export default Search;
