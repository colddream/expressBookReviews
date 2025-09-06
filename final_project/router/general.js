const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  // Get username and password from body
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password are provided
  if (!username) {
    return res.status(400).json({message: "Username is required"});
  }

  if (!password) {
    return res.status(400).json({message: "Password is required"});
  }

  // Check if username already exists
  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(400).json({message: "Username already exist"});
  }

  // Register the new user
  users.push({
    username: username,
    password: password
  })

  return res.status(201).json({message: "User registered successfully"})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Return all books
  // res.send(JSON.stringify(books, null, 4));
  
  // Using new getBooks function
  getBooks()
  .then((books) => {
    res.status(200).json(books);
  })
  .catch((error) => {
    res.status(500).json({ message: "Fetch books failed", error: error.message });
  });
});

function getBooks() {
  return new Promise((resolve, reject) => {
    // Simulate async operation
    setTimeout(() => {
      resolve(books);
    }, 100)
  });
}

// // Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   // Get isbn from request
//   const isbn = req.params.isbn;

//   // Check if book exist
//   if (books[isbn]) {
//     res.status(200).json(books[isbn]);
//   } else {
//     res.status(404).json({message: "Book not found"});
//   }
// });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // Get isbn from request
  const isbn = req.params.isbn;

  getBookByISBN(isbn)
    .then((book) => {
      res.status(200).json({book});
    })
    .catch((error) => {
      res.status(404).json({ message: error.message});
    });

});

// Get book by ISNB
function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    // Simulate async operation
    setTimeout(() => {
      // Check if book exist
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject(new Error("Book not found"));
      }
    }, 100)
  });
}

// // Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   const author = req.params.author;
//   const bookKeys = Object.keys(books);
//   let foundBooks = {};

//   // Iterate through the books
//   bookKeys.forEach(key => {
//     if (books[key].author === author) {
//       foundBooks[key] = books[key];
//     }
//   });

//   // Check if any books were found
//   if (Object.keys(foundBooks).length > 0) {
//     res.status(200).json(foundBooks);
//   } else {
//     res.status(404).json({message: "No books found for this author"})
//   }
// });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  getBooksByAuthor(author)
    .then((foundBooks) => {
      res.status(200).json(foundBooks);
    })
    .catch((error) => {
      res.status(404).json({ message: error.message })
    });
});

function getBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    // Simulate async operation
    setTimeout(() => {
      const bookKeys = Object.keys(books);
      let foundBooks = {};

      // Iterate through the books
      bookKeys.forEach(key => {
        if (books[key].author === author) {
          foundBooks[key] = books[key];
        }
      });

      // Check if any books were found
      if (Object.keys(foundBooks).length > 0) {
        resolve(foundBooks);
      } else {
        reject(new Error("No books found for this author"));
      }
    }, 100)
  });
}

// // Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   const title = req.params.title;
//   const bookKeys = Object.keys(books);
//   let foundBooks = {};

//   // Iterate through the books
//   bookKeys.forEach(key => {
//     if (books[key].title === title) {
//       foundBooks[key] = books[key];
//     }
//   });

//   // Check if any books were found
//   if (Object.keys(foundBooks).length > 0) {
//     res.status(200).json(foundBooks);
//   } else {
//     res.status(404).json({message: "No books found for this title"})
//   }
// });



// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  getBooksByTitle(title)
    .then((foundBooks) => {
      res.status(200).json(foundBooks);
    })
    .catch((error) => { 
      res.status(404).json({ message: error.message })
    });
});

// Get books by title
function getBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    // Simulate async operation
    setTimeout(() => {
      const bookKeys = Object.keys(books);
      let foundBooks = {};

      // Iterate through the books
      bookKeys.forEach(key => {
        if (books[key].title === title) {
          foundBooks[key] = books[key];
        }
      });

      // Check if any books were found
      if (Object.keys(foundBooks).length > 0) {
        resolve(foundBooks);
      } else {
        reject(new Error("No books found for this title"));
      }
    }, 100)
  });
}

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  // Check if book exist
  if (books[isbn]) {
    // Return book reviews
    res.status(200).json(books[isbn].reviews);
  } else {
    // Book not found
    res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
