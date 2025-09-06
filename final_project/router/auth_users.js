const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  // Check if username exists in users array
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.
  return users.some(user => user.username === username && user.password === password);
}

// Task 7
// only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password are provided
  if (!username) {
    return res.status(400).json({message: "Username is required"});
  }

  if (!password) {
    return res.status(400).json({message: "Password is required"});
  }

  // Validate username
  if (!isValid(username)){
    return res.status(404).json({message: "User not found"});
  }

  // Validate user credentials
  if (!authenticatedUser(username, password)){
    return res.status(401).json({message: "Invalid credentials. Check username and password."});
  }

  // Create JWT token
  const accessToken = jwt.sign({
     username : username
  }, "access", { expiresIn: '1h'});

  // Save user credentials in session
  req.session.authorization = {
    accessToken: accessToken,
    username: username
  }

  return res.status(200).json({message: "User logged in successfully"});
});

// Task 8
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Get isbn and review from request
  const isbn = req.params.isbn;
  const review = req.query.review;
  
  // Get username from session
  const username = req.user.username;

  // Check if review is provided
  if (!review) {
    return res.status(404).json({message: "Review is required"});
  }

  // Check if book exists
  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }

  // Add or modify the review for this user
  books[isbn].reviews[username] = review;

  return res.status(200).json({message: "Review added/modified successfully"})
});

// Task 9
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Get isbn
  const isbn = req.params.isbn;
  // Get username from session
  const username = req.user.username;
  
  // Check if book exists
  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }

  // Check if the user has a review for this book
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({message: "Review not found for this user"});
  }

  // Delete
  delete books[isbn].reviews[username];

  return res.status(200).json({message: "Review deleted successfully"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
