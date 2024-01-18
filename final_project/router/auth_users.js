const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});


//   return res.status(300).json({message: "Yet to be implemented"});
});

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  fetchBooks()
    .then(booksArray => {
      // Return the books as a JSON response
      res.status(200).json(booksArray);
    })
    .catch(error => {
      // Handle errors from the fetchBooks promise
      res.status(500).json({ message: error });
    })
    .finally(() => {
      // Console log after calling the promise
      console.log("After calling promise");
    });
//   res.send(JSON.stringify(books,null,4));
//   return res.status(300).json({message: "Yet to be implemented"});
});

const fetchBooks = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books);
          }, 1000); // Simulating a 1-second delay
        });
  };

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  try {
    // Call the promise and wait for it to be resolved
    const bookDetails = await getBookDetailsByISBNPromise(isbn);
    
    // Send the book details data as a JSON response
    res.status(200).json(bookDetails);
  } catch (error) {
    // Handle errors if any
    console.error("Error fetching book details:", error);
    res.status(404).json(error);
  }

//   const isbn = req.params.isbn;
// res.send(books[isbn])
//   return res.status(300).json({message: "Yet to be implemented"});
 });
  
 const getBookDetailsByISBNPromise = (isbn) => {
    return new Promise((resolve, reject) => {
      // Simulate an asynchronous operation (e.g., fetching data from a database or API)
      setTimeout(() => {
        const bookDetails = books[isbn];
        if (bookDetails) {
          resolve(bookDetails);
        } else {
          reject({ message: "Book not found for the specified ISBN." });
        }
      }, 1000); // Simulating a 1-second delay
    });
  };
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const requestedAuthor = req.params.author;

  // Call the promise and wait for it to be resolved
  getBooksByAuthorPromise(requestedAuthor)
    .then((matchingBooks) => {
      // Send the matching books data as a JSON response
      res.status(200).json(matchingBooks);
    })
    .catch((error) => {
      // Handle errors if any
      console.error("Error fetching books by author:", error);
      res.status(404).json(error);
    });
  /*if (typeof books !== 'object' || books === null) {
    return res.status(500).json({ message: "Internal server error: 'books' is not an object." });
  }

  // Get the author parameter from the request
  const requestedAuthor = req.params.author;

  // Convert 'books' object values to an array
  const booksArray = Object.values(books);

  // Filter books based on the requested author
  const matchingBooks = booksArray.filter(book => book.author === requestedAuthor);

  // Check if any matching books were found
  if (matchingBooks.length > 0) {
    // Return the matching books as a JSON response
    return res.status(200).json(matchingBooks);
  } else {
    // If no matching books were found, return a 404 Not Found status
    return res.status(404).json({ message: "No books found for the specified author." });
  }
  */
//   return res.status(300).json({message: "Yet to be implemented"});
});


const getBooksByAuthorPromise = (author) => {
    return new Promise((resolve, reject) => {
      // Simulate an asynchronous operation (e.g., fetching data from a database or API)
      setTimeout(() => {
        // Convert 'books' object values to an array
        const booksArray = Object.values(books);
  
        // Filter books based on the requested author
        const matchingBooks = booksArray.filter(book => book.author === author);
  
        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject({ message: "No books found for the specified author." });
        }
      }, 1000); // Simulating a 1-second delay
    });
  };
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const requestedTitle = req.params.title;

  // Call the promise and wait for it to be resolved
  getBooksByTitlePromise(requestedTitle)
    .then((matchingBooks) => {
      // Send the matching books data as a JSON response
      res.status(200).json(matchingBooks);
    })
    .catch((error) => {
      // Handle errors if any
      console.error("Error fetching books by title:", error);
      res.status(404).json(error);
    });
  /*
  if (typeof books !== 'object' || books === null) {
    return res.status(500).json({ message: "Internal server error: 'books' is not an object." });
  }

  // Get the author parameter from the request
  const requestedTitle = req.params.title;

  // Convert 'books' object values to an array
  const booksArray = Object.values(books);

  // Filter books based on the requested author
  const matchingBooks = booksArray.filter(book => book.title === requestedTitle);

  // Check if any matching books were found
  if (matchingBooks.length > 0) {
    // Return the matching books as a JSON response
    return res.status(200).json(matchingBooks);
  } else {
    // If no matching books were found, return a 404 Not Found status
    return res.status(404).json({ message: "No books found for the specified title." });
  }
  */
//   return res.status(300).json({message: "Yet to be implemented"});
});
 
const getBooksByTitlePromise = (title) => {
    return new Promise((resolve, reject) => {
      // Simulate an asynchronous operation (e.g., fetching data from a database or API)
      setTimeout(() => {
        // Convert 'books' object values to an array
        const booksArray = Object.values(books);
  
        // Filter books based on the requested title
        const matchingBooks = booksArray.filter(book => book.title === title);
  
        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject({ message: "No books found for the specified title." });
        }
      }, 1000); // Simulating a 1-second delay
    });
  };
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  // Check if 'books' is defined and is an object
  if (typeof books !== 'object' || books === null) {
    return res.status(500).json({ message: "Internal server error: 'books' is not an object." });
  }

  // Check if the book with the provided ISBN exists
  if (books.hasOwnProperty(isbn)) {
    // Get the reviews for the book with the specified ISBN
    const bookReviews = books[isbn].reviews;

    // Return the reviews as a JSON response
    return res.status(200).json(bookReviews);
  } else {
    // If the book with the specified ISBN is not found, return a 404 Not Found status
    return res.status(404).json({ message: "No reviews found for the specified ISBN." });
  }
//   return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
