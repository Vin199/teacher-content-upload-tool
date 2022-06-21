var bttn = document.getElementById("continue");

var modal_3 = document.getElementById("Modal__3");

// Get the <span> element that closes the modal
var span_3 = document.getElementsByClassName("close-3")[0];

// When the user clicks the button, open the modal 
bttn.onclick = function() {
  modal_3.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span_3.onclick = function() {
  modal_3.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal_3) {
    modal_3.style.display = "none";
  }
}