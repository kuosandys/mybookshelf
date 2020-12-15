//DOM selection: main
const shelf = document.getElementById("shelf");
const form = document.getElementById("form");
const formDiv = document.getElementById("form-div");
const addNewBookButton = document.getElementById("add-new-book");

//DOM selection: form elements
const newTitle = document.getElementById("new-title");
const newAuthor = document.getElementById("new-author");
const newPages = document.getElementById("new-pages");
const newReadStatus = document.getElementById("read-status");
const submitFormButton = document.getElementById("submit-form");
const cancelFormButton = document.getElementById("cancel-form");

//array for storing books
let myShelf = [];

//Book object
function Book(title, author, pages, readStatus) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.readStatus = readStatus;
}

//create a display card for Book
Book.prototype.render = function() {
    let elementDiv = document.createElement("div");
    elementDiv.classList.add("book");

    for (let key in this) {

        if ( this.hasOwnProperty(key) ) {

            let newP = document.createElement("p");

            newP.textContent = (key === "readStatus")
                ? ( (this[key] === true) ? "finished" : "not read yet" )
                : (key === "pages")
                    ? `${this[key]} pages`
                    : this[key];

            newP.classList.add(key);
            elementDiv.appendChild(newP);
        };

    };

    //add button to remove book
    let removeButton = document.createElement("button");
    removeButton.textContent = "x";
    removeButton.classList.add("remove-button");
    removeButton.addEventListener("click", () => removeBookFromShelf(this) );
    elementDiv.appendChild(removeButton);

    //add eventlistener to change reading status
    let readStatus = elementDiv.querySelector(".readStatus");
    readStatus.addEventListener("click", () => changeBookReadStatus(this) );

    return elementDiv;
};

//add new Book to myShelf
Book.prototype.addToMyShelf = function() {
    myShelf.push(this);
};

//delete Book from myShelf
Book.prototype.removeFromMyShelf = function() {
    myShelf = myShelf.filter(book => book !== this);
};

//change Book's reading status
Book.prototype.changeReadStatus = function() {
    this.readStatus = !this.readStatus;
};

//change Book's reading status
function changeBookReadStatus(book) {
    book.changeReadStatus();
    // change it in the external database
    displayShelf();
}

//remove Book
function removeBookFromShelf(book) {
    book.removeFromMyShelf();
    // remove it from the external database
    displayShelf();
}

//add a new Book from user input and store it in myShelf
function addBookToShelf() {
    let newBook = new Book(newTitle.value, newAuthor.value, newPages.value, newReadStatus.checked);
    newBook.addToMyShelf();
    // add to external database
    displayShelf();
}

//loop through myShelf to display each Book
function displayShelf() {
    //remove elements from the current shelf
    let currentShelf = Array.from( document.getElementsByClassName("book") );
    currentShelf.forEach((element) => {
        element.parentNode.removeChild(element);
    });

    //render each Book
    myShelf.forEach((book) => {
        shelf.appendChild( book.render() );
    });
}

//toggle display of form
function toggleFormDisplay() {
    form.classList.toggle("hide-form");
    form.classList.toggle("show-form");
}

//initialize the page
function startUp() {
    displayShelf();

    //addNewBook button: click to pop up form for adding books
    addNewBookButton.addEventListener("click", () => toggleFormDisplay() );

    //submit button: to close form and store new book object
    submitFormButton.addEventListener("click", () => {

        if (!form.checkValidity()) {
            alert("Please enter valid input!")
        } else {
            addBookToShelf();
            toggleFormDisplay();
        };

    });

    //cancel form button: to close form and clear form
    cancelFormButton.addEventListener("click", () => toggleFormDisplay() );
}

startUp();