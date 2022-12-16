import express from "express";
import mysql2 from "mysql2";
import cors from "cors";
import fs from "fs";
import path from "path";

import multer from "multer";

// const express = require("express");
// const mysql2 = require("mysql2");
// const cors = require("cors");
// const fs = require("fs");
// const multer = require("multer");
// const path = require("path");

const app = express();

if (!fs.existsSync("C:/book-database")) {
  console.log("exists");
  fs.mkdir("C:/book-database", (error) => {
    error ? console.log(error) : console.log("Path created");
  });
}

const db = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "talorong0419",
  database: "rds_books",
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  const q = "SELECT * FROM rds_books.books";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
let fileName;
app.get("/get-lastbooknumber", (req, res) => {
  const q = "SELECT MAX(book_number) AS 'latest_book' FROM rds_books.books";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/search/:term", (req, res) => {
  const { term } = req.params;
  console.log(term);
  const q = `SELECT * FROM rds_books.books WHERE lower(book_title) LIKE '%${term}%' OR lower(book_author) LIKE '%${term}%' OR lower(ctrl_number) LIKE '%${term}%' OR CAST(publish_year AS CHAR) like '%${term}%'`;

  console.log(q);

  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/add", (req, res) => {
  const q =
    "INSERT INTO books (`book_title`, `book_author`, `publish_year`, `ctrl_number`, `course`, `book_number`) VALUES (?)";
  const values = [
    req.body.book_title,
    req.body.book_author,
    req.body.publish_year,
    req.body.ctrl_number,
    req.body.course,
    req.body.book_number,
  ];

  fileName = req.body.ctrl_number;

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.put("/edit", (req, res) => {
  // console.log(req.body);
  const {
    book_title,
    book_author,
    publish_year,
    book_number,
    course,
    ctrl_number,
  } = req.body;

  // filename = ctrl_number;

  // console.log("filename is Changed");
  const q =
    "UPDATE books SET book_title = ?, book_author = ?, publish_year = ?, ctrl_number = ?, course = ? WHERE book_number = ? ";

  const values = [
    book_title,
    book_author,
    publish_year,
    ctrl_number,
    course,
    book_number,
  ];

  // console.log("q :", q);
  db.query(q, [...values], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });

  // fs.rename("C:/book-database/");
});

app.put("/rename-file-image", (req, res) => {
  // console.log(req.body);
  const { ctrl_number, originalControlNumber } = req.body;
  fs.rename(
    `C:/book-database/${originalControlNumber}.jpg`,
    `C:/book-database/${ctrl_number}.jpg`,
    (err) => {
      if (err) console.log(err);
      console.log("file-renamed");
    }
  );
  return res.json({});
});

app.delete("/delete-img/:originalControlNumber/:ctrl", (req, res) => {
  console.log("to delete", req.params);
  fileName = req.params.ctrl;
  // console.log("to rename to: ", req.params.ctrl_number);
  fs.unlink(
    `C:/book-database/${req.params.originalControlNumber}.jpg`,
    (err) => {
      return res.json(err);
    }
  );
  // return res.json({});
});

// for uploading img
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "C:/book-database");
  },
  filename: (req, file, cb) => {
    cb(null, `${fileName}.jpg`);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("img"), (req, res) => {
  // return res.json("file received: ", req.body.img);
  // console.log(req.body.image);
  return res.send("iamge uploaded");
});

app.use(express.static("C:/book-database"));

app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "DELETE FROM books WHERE ctrl_number = ?";

  db.query(q, [bookId], (err, data) => {
    if (err) return res.json(err);
    // return res.json("Book has been deleted.");
  });

  fs.unlink(`C:/book-database/${bookId}.jpg`, (err) => {
    return res.json(err);
  });
});

app.listen(8800, () => {
  console.log("connected to backendssss");
});

// app.get("/get-abstract", (req, res) => {
//   console.log("get abstract is reached");
//   const fileNameAbstract = req.query.ctrlNumber;
//   console.log(fileNameAbstract, "\n----------");

//   fs.readFile(`C:/book-database/${fileNameAbstract}.jpg`, (err, data) => {
//     if (err) return res.json(err);
//     // console.log(data);
//     return res.sendFile(`C:/book-database/${fileNameAbstract}.jpg`, (err) => {
//       console.log(err);
//     });
//   });
// });
