import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import { TextField, Typography } from "@mui/material";
import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const Home = () => {
  const navigate = useNavigate();

  const StyledTextField = styled(TextField)(() => ({
    width: 260,
  }));

  const StyledButton = styled(Button)(() => ({
    width: 260,
  }));
  return (
    <div className="Home">
      <Card>
        <CardContent>
          <form className="search-book">
            <label>
              <Typography variant="h5" component="h1">
                Search for Books
              </Typography>
              <div className="input-container">
                <StyledTextField></StyledTextField>
              </div>

              <StyledButton
                sx={{ margin: 2, backgroundColor: "green" }}
                variant="contained"
              >
                Search
              </StyledButton>
            </label>
          </form>

          <StyledButton
            sx={{ backgroundColor: "green" }}
            onClick={() => navigate("/add-book")}
            variant="contained"
          >
            Add new Book
          </StyledButton>
        </CardContent>
      </Card>

      <main className="book-list"></main>
    </div>
  );
};

export default Home;
