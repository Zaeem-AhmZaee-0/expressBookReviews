const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    let existingUser = users.filter((user) => user.username === username);
    if (existingUser.length === 0) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(409).json({message: "User already exists!"});
    }
  }
  return res.status(400).json({message: "Unable to register user. Username and/or password not provided."});
});

public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});
  
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const matchingBooks = [];
  const bookKeys = Object.keys(books);
  
  for (let key of bookKeys) {
    if (books[key].author === author) {
      matchingBooks.push(books[key]);
    }
  }
  
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({message: "No books found by this author"});
  }
});

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const matchingBooks = [];
  const bookKeys = Object.keys(books);
  
  for (let key of bookKeys) {
    if (books[key].title === title) {
      matchingBooks.push(books[key]);
    }
  }
  
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({message: "No books found with this title"});
  }
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// ==========================================
// AXIOS HTTP REQUESTS (Tasks 10-13)
// ==========================================

async function getAllBooksAxios() {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching all books:", error);
  }
}

async function getBookByISBNAxios(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching book by ISBN:", error);
  }
}

async function getBookByAuthorAxios(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log(response.data);
  } catch (error) {
    console.error("Author not found:", error);
  }
}

async function getBookByTitleAxios(title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    console.log(response.data);
  } catch (error) {
    console.error("Title not found:", error);
  }
}

module.exports.general = public_users;