const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
const user = users.find(user => user.username === username);
return !!user;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
const user = users.find(user => user.username === username && user.password === password);
return !!user; // Returns true if the user is found, false otherwise

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required for login." });
  }

  // Check if the username is valid
  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username." });
  }

    // Check if the username and password match
    if (authenticatedUser(username, password)) {
        // Generate a JWT token for the authenticated user
        const accessToken = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });
    
        // Save the token in the session
        req.session.authorization = {
          accessToken,
          username,
        };
    
        // Return the token as a response
        return res.status(200).json({ accessToken });
      } else {
        return res.status(401).json({ message: "Invalid username or password." });
      }
//   return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { authorization } = req.headers;
  const { username } = req.session.authorization;
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!authorization) {
    return res.status(401).json({ message: "Authorization header missing." });
  }

  jwt.verify(authorization.split(' ')[1], 'secret_key', (err, decoded) => {
    // if (err || decoded.username !== username) {
    //   return res.status(401).json({ message: "Invalid token or token does not match the session user." });
    // }
    if (books.hasOwnProperty(isbn)) {
        // Check if the book already has reviews
        if (!books[isbn].reviews) {
          books[isbn].reviews = {};
        }
  
        // Check if the user already has a review for the same ISBN
        if (books[isbn].reviews.hasOwnProperty(username)) {
          // Modify the existing review
          books[isbn].reviews[username] = review;
        } else {
          // Add a new review for the user
          books[isbn].reviews[username] = review;
        }
  
        // Return success message
        return res.status(200).json({ message: "Review added or modified successfully." });
      } else {
        // If the book with the specified ISBN is not found, return a 404 Not Found status
        return res.status(404).json({ message: "Book not found for the specified ISBN." });
      }
    });
//   return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { authorization } = req.headers;
  const { username } = req.session.authorization;
  const isbn = req.params.isbn;

  if (!authorization) {
    return res.status(401).json({ message: "Authorization header missing." });
  }

  jwt.verify(authorization.split(' ')[1], 'secret_key', (err, decoded) => {
    // if (err || decoded.username !== username) {
    //   return res.status(401).json({ message: "Invalid token or token does not match the session user." });
    // }
    if (books.hasOwnProperty(isbn)) {
        // Check if the book has reviews
        if (books[isbn].reviews) {
          // Check if the user has submitted a review for the specified ISBN
          if (books[isbn].reviews.hasOwnProperty(username)) {
            // Delete the user's review
            delete books[isbn].reviews[username];
  
            // Return success message
            return res.status(200).json({ message: "Review deleted successfully." });
          } else {
            // If the user hasn't submitted a review for the specified ISBN, return a 404 status
            return res.status(404).json({ message: "No review found for the specified ISBN and user." });
          }
        } else {
          // If the book has no reviews, return a 404 status
          return res.status(404).json({ message: "No reviews found for the specified ISBN." });
        }
      } else {
         // If the book with the specified ISBN is not found, return a 404 status
      return res.status(404).json({ message: "Book not found for the specified ISBN." });
    }
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
