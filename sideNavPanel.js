/* Open NavBar */
var hidden = document.getElementById("hidden");
var dataBitsInputArea2 = document.getElementById("dataBits");

function openNav() {
  if (window.innerWidth != 500) {
    document.getElementById("mySidepanel").style.width = "400px";
    overlayBlur.style.display = "block";
  }
}

/* Close NavBar */
function closeNav() {
  document.getElementById("mySidepanel").style.width = "0px";
  overlayBlur.style.display = "none";
}

function Close() {
  hidden.style.display = "none";
}
