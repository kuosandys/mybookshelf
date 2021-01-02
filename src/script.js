import 'normalize.css'
import './style_modern.scss'

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

let myShelf = [];

//Book class
class Book{
    constructor(title, author, pages, readStatus) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.readStatus = readStatus;
        this.index;
    }

    render() {
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
    
            };
    
        };
    
        elementDiv.appendChild(elementInfo);
        elementDiv.appendChild(elementDetails);
    
        //add button to remove book
        let removeButton = document.createElement("button");
        removeButton.innerHTML = "<img src=\"../images/trash_can.png\">";
        removeButton.classList.add("remove-button");
        removeButton.addEventListener("click", () => removeBookFromShelf(this) );
        elementDiv.appendChild(removeButton);
    
        //add eventlistener to change reading status
        let readStatus = elementDiv.querySelector(".readStatus");
        readStatus.addEventListener("click", () => changeBookReadStatus(this) );
    
        return elementDiv;
    }

    add = () => {
        myShelf.push(this);
        this.index = myShelf.indexOf(this);
    }

    remove = () => {
        myShelf = myShelf.filter(book => book !== this);
    }

    changeStatus = () => {
        this.readStatus = !this.readStatus;
    }

};

//initialize the page
function startUp() {
    if (localStorage.getItem("myShelf")) {

        let tempShelf = Array.from( JSON.parse( window.localStorage.getItem("myShelf") ) );
        tempShelf.forEach( tempBook => {
            let newBook = Object.assign(new Book(), tempBook);
            myShelf.push(newBook);
        });
        
        displayShelf();
    };

    addNewBookButtons.addEventListener("click", () => toggleFormDisplay() );

    submitFormButton.addEventListener("click", () => {

        if (!form.checkValidity()) {
            alert("Please enter valid input!")
        } else {
            addBookToShelf();
            toggleFormDisplay();
            form.reset();
        };

    });

    cancelFormButton.addEventListener("click", () => {
        toggleFormDisplay()
        form.reset();
    });
}

function displayShelf() {
    let currentShelf = Array.from( document.getElementsByClassName("book") );
    currentShelf.forEach(element => {
        element.parentNode.removeChild(element);
    });

    myShelf.forEach(book => {
        shelf.appendChild( book.render() );
    });
}

function changeBookReadStatus(book) {
    book.changeStatus();
    updateLocalStorage();
    displayShelf();
}

function removeBookFromShelf(book) {
    book.remove();
    updateLocalStorage();
    displayShelf();
}

function addBookToShelf() {
    let newBook = new Book(newTitle.value, newAuthor.value, newPages.value, newReadStatus.checked);
    newBook.add();
    updateLocalStorage();
    displayShelf();
}

function toggleFormDisplay() {
    form.classList.toggle("hide-form");
    form.classList.toggle("show-form");
}

function updateLocalStorage() {
    localStorage.setItem("myShelf", JSON.stringify(myShelf));
}

startUp();