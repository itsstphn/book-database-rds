import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

import DataTable from "./../components/DataTable";
import Search from "./../components/Search";
import styled from "@emotion/styled";
import { TextField } from "@mui/material";
import rdsLogo from "../assets/img/Picture10.png";
import bryanLogo from "../assets/img/CF new logo.png";
import axios from "axios";

const Home = () => {
  const [books, setBooks] = useState([]);
  // console.log(searchTerm);
  const [rows, setRows] = useState([]);

  // useEffect(() => {
  //   const itemRows = [];
  //   books.forEach((item) =>
  //     itemRows.push({
  //       bookTitle: item.book_title,
  //       bookAuthor: item.book_author,
  //       publishYear: item.publish_year,
  //       id: item.ctrl_number,
  //     })
  //   );
  //   setRows(itemRows);
  // }, [books]);

  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        const res = await axios.get("http://localhost:8800/");
        console.log("fetched!!!");
        setBooks(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllBooks();
  }, []);

  const handleSearchClick = async (searchTerm) => {
    console.log("tosearch: ", searchTerm);
    try {
      const res = await axios.get("http://localhost:8800/search/" + searchTerm);
      console.log(res);
      setBooks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // console.log(searchTerm);

  return (
    <div className="Home">
      <div className="search">
        <Search handleSearchClick={handleSearchClick}></Search>
      </div>

      <main className="book-list">
        <DataTable books={books}></DataTable>
      </main>

      <div className="credits">
        <p>Created by: BSIT OJT Students 2022</p>
        <p>Stephen Talorong</p>
        <p>Bryan Mondoy</p>
      </div>
    </div>
  );
};

export default Home;
