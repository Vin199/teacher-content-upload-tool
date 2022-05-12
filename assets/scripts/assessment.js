var btn = document.getElementById("single__upload");

var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
/* span.onclick = function () {
    modal.style.display = "none";
} */
span.addEventListener('click', () => {
    closeModal();
});

function closeModal(){
    modal.style.display = "none";
    // return new Promise((resolve, reject) => {
    //     modal.style.display = "none";
    //     resolve();
    // })
}

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});


/* For the Second Modal */

var bttn = document.getElementById("btn-1");
var modal__2 = document.getElementById("Modal__2");


var back_btn = document.querySelector(".back-2");

back_btn.addEventListener('click', () => {
    close_modal_2().then(() => {
        modal.style.display = "block";
    })
})

function close_modal_2() {
    return new Promise((resolve, reject) => {
        modal__2.style.display = "none";
        resolve();
    })
}


// Get the <span> element that closes the modal-2
var span__2 = document.getElementsByClassName("close-2")[0];

// When the user clicks the button, open the modal-2 
bttn.addEventListener('click', () => {
    openModal()
    .then(() => closeModal())
});

function openModal(){
    return new Promise((resolve, reject) => {
        modal__2.style.display = "block";
        resolve();
    })
}        

// When the user clicks on <span> (x), close the modal-2
span__2.addEventListener('click', () => {
    closeModal_2();
});

function closeModal_2(){
    modal__2.style.display = "none";
    // return new Promise((resolve, reject) => {
    //     modal__2.style.display = "none";
    //     resolve();
    // })
}

// When the user clicks anywhere outside of the modal-2, close it
window.onclick = function (event) {
    if (event.target == modal__2) {
        modal__2.style.display = "none";
    }
}
