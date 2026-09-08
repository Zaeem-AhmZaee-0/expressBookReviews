const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


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

// Task 10: Get the book list available in the shop using Promises
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books);
  })
  .then((bookList) => {
    res.send(JSON.stringify(bookList, null, 4));
  })
  .catch((error) => {
    res.status(500).json({message: "Error fetching books."});
  });
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  })
  .then((book) => {
    res.status(200).json(book);
  })
  .catch((error) => {
    res.status(404).json({message: error});
  });
});
  
// Task 12: Get book details based on author using Promises
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  
  new Promise((resolve, reject) => {
    const matchingBooks = [];
    const bookKeys = Object.keys(books);
    
    for (let key of bookKeys) {
      if (books[key].author === author) {
        matchingBooks.push(books[key]);
      }
    }
    
    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("No books found by this author");
    }
  })
  .then((matchingBooks) => {
    res.status(200).json(matchingBooks);
  })
  .catch((error) => {
    res.status(404).json({message: error});
  });
});

// Task 13: Get all books based on title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  
  new Promise((resolve, reject) => {
    const matchingBooks = [];
    const bookKeys = Object.keys(books);
    
    for (let key of bookKeys) {
      if (books[key].title === title) {
        matchingBooks.push(books[key]);
      }
    }
    
    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("No books found with this title");
    }
  })
  .then((matchingBooks) => {
    res.status(200).json(matchingBooks);
  })
  .catch((error) => {
    res.status(404).json({message: error});
  });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;