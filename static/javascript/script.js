//toggle dropdown on click
function dropdown() {
    document.getElementById("dropdown").classList.toggle("show");
}

//close dropdown menu if clicked outside boundaries
window.onclick = function(event) {
    if (!event.target.matches('.dropdownButton')) {
      var dropdowns = document.getElementsByClassName("dropdownContent");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }