// Array for storing books
let myLibrary = [];

renderLibrary();

// Book object storing each book's title, author, pages, read/not-read
function Book(title, author, pages, read) {
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
    this.index = myLibrary.length
};

// Function to take users input and store new Books in myLibrary
function addBookToLibrary(title, author, pages, read) {
    let newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);
};

// Render function to display each Book in myLibrary
function renderBook(book) {
    let books = document.getElementById("books");
    let addBook = document.getElementById("add-book");
    let bookDiv = document.createElement("div");
    bookDiv.classList.add("book", "my-book");
    bookDiv.setAttribute("id", book.index);
    for (let key in book) {
        if (book.hasOwnProperty(key)) {
            let value = book[key];
            let newP = document.createElement("p");
            if (key == "pages") {
                newP.textContent = `${value} pages`;
            } else if (key == "index") {
                continue;
            } else {
                newP.textContent = value;
            }
            newP.classList.add(key);
            bookDiv.appendChild(newP);
        };
    };

    // Add button for removal
    let removeButton = document.createElement("button");
    removeButton.innerHTML = "x";
    removeButton.classList.add("remove-button");
    bookDiv.appendChild(removeButton);

    bookDiv.style.order = myLibrary.indexOf(book);
    books.appendChild(bookDiv);

    // Set the order style property for add-new button to be last
    let lengthLibrary = myLibrary.length;
    addBook.style.order = lengthLibrary;
};

// Remove a book
function removeBook(e) {
    let idx = e.target.parentNode.id;
    myLibrary = myLibrary.filter((book) => book.index != idx);
    renderLibrary();
};

// Change reading status
function changeReadingStatus(e) {
    let bookStatus = e.target.textContent;
    let idx = e.target.parentNode.id;
    let selectedBook = myLibrary.filter((book) => book.index == idx);
    switch (bookStatus) {
        case "yet to read":
            e.target.textContent = "currently reading";
            selectedBook.read = "currently reading";
            break;
        case "currently reading":
            e.target.textContent = "read";
            selectedBook.read = "read";
            break;
        case "read":
            e.target.textContent = "yet to read";
            selectedBook.read = "yet to read";
            break;
    }
}


// Displays the entire library on the page
function renderLibrary() {
    let myBooks = Array.from(document.getElementsByClassName("my-book"));
    myBooks.forEach((book) => {
        book.parentNode.removeChild(book);
    });
    myLibrary.forEach(renderBook);

    // Add eventlistener for remove buttons
    let removeButtons = Array.from(document.getElementsByClassName("remove-button"));
    removeButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            removeBook(event);
        });
    });

    // Add eventlistner to toggle reading status
    let readingButtons = Array.from(document.getElementsByClassName("read"));
    readingButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            changeReadingStatus(event);
        });
    });
};

// Click to popup form to add new book
let form = document.getElementById("form");
let formDiv = document.getElementById("form-div");
let addBook = document.getElementById("add-book");
addBook.addEventListener("click", () => {
    form.style.display = "block";
    formDiv.style.display = "initial";
});

// Click submit to close form and store new book object
let submitButton = document.getElementById("submit-button");
submitButton.addEventListener("click", () => {
    let newTitle = document.getElementById("new-title").value;
    let newAuthor = document.getElementById("new-author").value;
    let newPages = document.getElementById("new-pages").value;
    let radioButtons = document.getElementsByName("read");
    let newRead;
    for (let i=0; i<radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            newRead = radioButtons[i].value;
            break;
        };
    };
    addBookToLibrary(newTitle, newAuthor, newPages, newRead);
    renderLibrary();
    form.style.display = "none";
    form.reset();
    formDiv.style.display = "none";
});