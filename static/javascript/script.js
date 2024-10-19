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

// by default only first categoryButton should be active, rest should have .ghost class
function chooseCategory(categoryId) {
  var i, categoryButton, subcategoryColumn;
  
  //grey out inactive categoryButtons
  categoryButton = document.getElementsByClassName("categoryButton");
  for (i = 0; i < categoryButton.length; i++) {
    if (categoryButton[i].id === categoryId) {
      categoryButton[i].classList.remove("ghost");
    } else {
      categoryButton[i].classList.add("ghost");
    }
  }

  //noShow is default class for subcategoryColumn
  subcategoryColumn = document.getElementsByClassName("subcategoryColumn");

  for (i = 0; i < subcategoryColumn.length; i++) {
    //hide all subcategoryColumn again???
    subcategoryColumn[i].classList.replace("show", "noShow");
  }

  for (i = 0; i < subcategoryColumn.length; i++) {
  //replace noShow with show for subcategoryColumn that match clicked category
    if (subcategoryColumn[i].getAttribute("data-category") === categoryId) {
      subcategoryColumn[i].classList.replace("noShow", "show");
    }
  }
}

function toggleSelectable(promptId) {
  var promptButton = document.getElementById(promptId);
  
  if (promptButton) {
    promptButton.classList.toggle("ghost");
  }
}