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

// categories where only one prompt is allowed for the whole thing
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
          
          // Filter subcategories to include only those with available prompts (not using ghost class)
          let validSubcategories = Array.from(subcategories).filter(function(subcategory) {
              let prompts = subcategory.querySelectorAll(".selectablePrompt:not(.ghost)");
              return prompts.length > 0;
          });

          // If valid subcategories are found, pick one randomly
          if (validSubcategories.length > 0) {
              let randomSubcategoryIndex = Math.floor(Math.random() * validSubcategories.length);
              let selectedSubcategory = validSubcategories[randomSubcategoryIndex];

              let prompts = selectedSubcategory.querySelectorAll(".selectablePrompt:not(.ghost)");
              if (prompts.length > 0) {
                  let randomIndex = Math.floor(Math.random() * prompts.length);
                  let selectedPrompt = prompts[randomIndex];
                  console.log("Selected prompt from a single subcategory: ", selectedPrompt.textContent);
                  selectedPrompts[categoryId] = selectedPrompt.textContent;
              }
          } else {
              console.log(`No valid prompts available in category: ${categoryName}`);
          }

      } else {
          // For regular categories: pick one prompt from each subcategory
          let subcategories = document.querySelectorAll(`.subcategoryColumn[data-category='${categoryId}']`);

          subcategories.forEach(function(subcategory) {
              let subcategoryId = subcategory.querySelector(".subcategoryTitle").id;
              let prompts = subcategory.querySelectorAll(".selectablePrompt:not(.ghost)");
              
              if (prompts.length > 0) {
                  let randomIndex = Math.floor(Math.random() * prompts.length);
                  let selectedPrompt = prompts[randomIndex];
                  console.log("Selected prompt from subcategory: ", selectedPrompt.textContent);
                  selectedPrompts[`${categoryId}-${subcategoryId}`] = selectedPrompt.textContent;
              } else {
                  console.log(`No valid prompt in subcategory ${subcategoryId}`);
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

document.querySelectorAll('.probabilityUp').forEach(function(upButton) {
  upButton.addEventListener('click', function() {
      var promptId = this.parentElement.parentElement.querySelector('.prompt').id;
      updateProbability(promptId, 0.1);
  });
});

document.querySelectorAll('.probabilityDown').forEach(function(downButton) {
  downButton.addEventListener('click', function() {
      var promptId = this.parentElement.parentElement.querySelector('.prompt').id;
      updateProbability(promptId, -0.1);
  });
});

function updateProbability(promptId, increment) {
  var probabilityDisplay = document.getElementById(`probabilityDisplay-${promptId}`);
  var currentProbability = parseFloat(probabilityDisplay.textContent);

  var newProbability = Math.min(1, Math.max(0.1, currentProbability + increment));

  probabilityDisplay.textContent = newProbability.toFixed(1);

  // Learn more about AJAX later :)
  fetch('/update-probability/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRFToken': getCookie('csrftoken'),  // Include CSRF token for security
    },
    body: `prompt_id=${encodeURIComponent(promptId)}&probability=${newProbability}`
  })
  .then(response => response.json())
  .then(data => {
      if (data.status !== 'success') {
          alert('Failed to update probability: ' + data.message);
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      let cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          let cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}
