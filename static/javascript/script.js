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
window.onload = function() {
  var firstCategory = document.getElementById("Species");
  firstCategory.classList.remove("ghost");

  var subcategoryColumns = document.getElementsByClassName("subcategoryColumn");
  
  // Loop through subcategory columns to find the one with the correct data-category attribute
  for (var i = 0; i < subcategoryColumns.length; i++) {
    if (subcategoryColumns[i].getAttribute("data-category") === "Species") {
      subcategoryColumns[i].classList.replace("noShow", "show");
    }
  }
}

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
  
  promptButton.classList.toggle("ghost");

  promptButton.offsetHeight;  // force page reload??
}

// Enter names of categories where only one prompt per subcategory is allowed
const singleSubcategoryCategories = ['Species', 'Weapons'];

function generatePrompt() {
    let selectedPrompts = {};
    let categories = document.querySelectorAll(".categoryButton");

    categories.forEach(function(category) {
        let categoryId = category.id;
        let categoryName = category.textContent.trim();

        // Check if the category is in the singleSubcategoryCategories array
        if (singleSubcategoryCategories.includes(categoryName)) {
            let subcategories = document.querySelectorAll(`.subcategoryColumn[data-category='${categoryId}']`);
            let randomSubcategoryIndex = Math.floor(Math.random() * subcategories.length);
            let selectedSubcategory = subcategories[randomSubcategoryIndex];

            let prompts = selectedSubcategory.querySelectorAll(".selectablePrompt:not(.ghost)");
            if (prompts.length > 0) {
                let randomIndex = Math.floor(Math.random() * prompts.length);
                let selectedPrompt = prompts[randomIndex];
                selectedPrompts[categoryId] = selectedPrompt.textContent;
            }

        } else {
          // regular generation
          let subcategories = document.querySelectorAll(`.subcategoryColumn[data-category='${categoryId}']`);

          subcategories.forEach(function(subcategory) {
              let subcategoryId = subcategory.querySelector(".subcategoryTitle").id;
              let prompts = subcategory.querySelectorAll(".selectablePrompt:not(.ghost)");
              if (prompts.length > 0) {
                  let randomIndex = Math.floor(Math.random() * prompts.length);
                  let selectedPrompt = prompts[randomIndex];
                  selectedPrompts[`${categoryId}-${subcategoryId}`] = selectedPrompt.textContent;
              }
          });
        }
    });

    let outputDiv = document.getElementById("generatedPrompt");
    outputDiv.innerHTML = '';

    for (let key in selectedPrompts) {
        let promptText = selectedPrompts[key];
        let promptElement = document.createElement("p");
        promptElement.textContent = promptText;
        outputDiv.appendChild(promptElement);
    }
}