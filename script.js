//DOM selection: main
const shelf = document.getElementById("shelf");
const form = document.getElementById("form");
const addNewBookButtons = document.getElementById("add-new-book");

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
    this.index;
}

//create a display card for Book
Book.prototype.render = function() {
    let elementDiv = document.createElement("div");
    elementDiv.classList.add("book");

    let elementInfo = document.createElement("div");
    elementInfo.classList.add("book-info");

    let elementDetails = document.createElement("div");
    elementDetails.classList.add("book-details");

    for (let key in this) {

        if ( this.hasOwnProperty(key) ) {

            let newP = document.createElement("p");
            newP.classList.add(key);

            switch(key) {
                case "title":
                case "author":
                    newP.textContent = this[key];
                    elementInfo.appendChild(newP);
                    break;
                case "pages":
                    newP.textContent = `${this[key]} pages`
                    elementDetails.appendChild(newP);
                    break;
                case "readStatus":
                    newP.textContent = (this[key] === true) ? "finished" : "in progress";
                    elementDetails.appendChild(newP);
                    break;
            };
            // newP.textContent = (key === "readStatus")
            //     ? ( (this[key] === true) ? "finished" : "not read yet" )
            //     : (key === "pages")
            //         ? `${this[key]} pages`
            //         : this[key];

        };

    };

    elementDiv.appendChild(elementInfo);
    elementDiv.appendChild(elementDetails);

    //add button to remove book
    let removeButton = document.createElement("button");
    removeButton.innerHTML = "<img src=\"images/trash_can.png\">";
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
    this.index = myShelf.indexOf(this);
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
    updateLocalStorage();
    displayShelf();
}

//remove Book
function removeBookFromShelf(book) {
    book.removeFromMyShelf();
    updateLocalStorage();
    displayShelf();
}

//add a new Book from user input and store it in myShelf
function addBookToShelf() {
    let newBook = new Book(newTitle.value, newAuthor.value, newPages.value, newReadStatus.checked);
    newBook.addToMyShelf();
    updateLocalStorage();
    displayShelf();
}

//loop through myShelf to display each Book
function displayShelf() {
    //remove elements from the current shelf
    let currentShelf = Array.from( document.getElementsByClassName("book") );
    currentShelf.forEach(element => {
        element.parentNode.removeChild(element);
    });

    //render each Book
    myShelf.forEach(book => {
        shelf.appendChild( book.render() );
    });
}

//toggle display of form
function toggleFormDisplay() {
    form.classList.toggle("hide-form");
    form.classList.toggle("show-form");
}

function updateLocalStorage() {
    window.localStorage.clear();
    window.localStorage.setItem("myShelf", JSON.stringify(myShelf));
}

function loadLocalStorage() {
    let tempShelf = Array.from( JSON.parse( window.localStorage.getItem("myShelf") ) );
    tempShelf.forEach( tempBook => {
        let newBook = Object.assign(new Book(), tempBook);
        myShelf.push(newBook);
    });
}

//initialize the page
function startUp() {
    if (localStorage.length != 0) {
        loadLocalStorage();
        displayShelf();
    };

    //addNewBook button: click to pop up form for adding books
    addNewBookButtons.addEventListener("click", () => toggleFormDisplay() );

    //submit button: to close form and store new book object
    submitFormButton.addEventListener("click", () => {

        if (!form.checkValidity()) {
            alert("Please enter valid input!")
        } else {
            addBookToShelf();
            toggleFormDisplay();
            form.reset();
        };

    });

    //cancel form button: to close form and clear form
    cancelFormButton.addEventListener("click", () => {
        toggleFormDisplay()
        form.reset();
    });
}

startUp();