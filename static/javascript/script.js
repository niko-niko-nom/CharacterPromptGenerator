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
const singleSubcategoryCategories = ['Species', 'Weapons', 'Religion'];

function generatePrompt() {
  let selectedPrompts = {};
  let categories = document.querySelectorAll(".categoryButton");

  console.log("Categories found:", categories); // Log available categories

  categories.forEach(function(category) {
      let categoryId = category.id;
      let categoryName = category.textContent.trim();
      console.log("Current category:", categoryName); // Log each category

      // Check if the category is in the singleSubcategoryCategories array
      if (singleSubcategoryCategories.includes(categoryName)) {
        console.log(`Category ${categoryName} is a single-subcategory category`);

        let subcategories = document.querySelectorAll(`.subcategoryColumn[data-category='${categoryId}']`);
        console.log(`Subcategories for ${categoryName}:`, subcategories); // Log subcategories

        // Filter subcategories to include only those with available prompts (not using ghost class)
        let validSubcategories = Array.from(subcategories).filter(function(subcategory) {
          let prompts = subcategory.querySelectorAll(".selectablePrompt:not(.ghost)");
          console.log(`Prompts for subcategory ${subcategory.getAttribute("data-category")}:`, prompts); // Log prompts in each subcategory
          return prompts.length > 0;
        });

        console.log(`Valid subcategories for ${categoryName}:`, validSubcategories); // Log valid subcategories

        // If valid subcategories are found, pick one randomly
        if (validSubcategories.length > 0) {
          let randomSubcategoryIndex = Math.floor(Math.random() * validSubcategories.length);
          let selectedSubcategory = validSubcategories[randomSubcategoryIndex];
          console.log("Selected subcategory:", selectedSubcategory); // Log selected subcategory
        
          let selectablePrompts = selectedSubcategory.querySelectorAll(".selectablePrompt:not(.ghost)");
          let prompts = Array.from(selectablePrompts).map(prompt => prompt.id);
          console.log("Available prompts:", prompts); // Log available prompts
        
          if (prompts.length > 0) {
            // Select probability divs only for the prompts within the selected subcategory
            const probabilityDivs = selectedSubcategory.querySelectorAll(`.probability_${selectedSubcategory.querySelector(".subcategoryTitle").id.trim().replace(/\s/g, '')}`);
            
            const probabilities = [];
            
            probabilityDivs.forEach(div => {
              probabilities.push(div.innerHTML);
            });
        
            console.log("Probabilities for the selected subcategory:", probabilities); // Log probabilities
        
            let selectedPrompt = weightedRandomChoices(prompts, probabilities);
            console.log("Selected prompt:", selectedPrompt); // Log the selected prompt
            selectedPrompts[categoryId] = selectedPrompt;
          }
        } else {
          console.log(`No valid prompts available in category: ${categoryName}`); // Log if no valid prompts are found
        }
        

      } else {
          console.log(`Category ${categoryName} is a regular category`);

          // For regular categories: pick one prompt from each subcategory
          let subcategories = document.querySelectorAll(`.subcategoryColumn[data-category='${categoryId}']`);
          console.log(`Subcategories for ${categoryName}:`, subcategories); // Log subcategories

          subcategories.forEach(function(subcategory) {
              let subcategoryId = subcategory.querySelector(".subcategoryTitle").id;
              console.log("Current subcategory:", subcategoryId); // Log each subcategory

              let selectablePrompts = subcategory.querySelectorAll(".selectablePrompt:not(.ghost)");
              let prompts = Array.from(selectablePrompts).map(prompt => prompt.id);
              console.log(`Prompts in subcategory ${subcategoryId}:`, prompts); // Log available prompts

              if (prompts.length > 0) {
                const probabilityDivs = document.querySelectorAll(`.probability_${subcategoryId.trim().replace(/\s/g, '')}`);
                console.log(`Probability divs for ${subcategoryId}:`, probabilityDivs); // Log probability divs

                const probabilities = [];
                probabilityDivs.forEach(div => {
                  probabilities.push(div.innerHTML);
                });

                console.log("Probabilities:", probabilities); // Log probabilities

                let selectedPrompt = weightedRandomChoices(prompts, probabilities);
                console.log("Selected prompt:", selectedPrompt); // Log selected prompt
                selectedPrompts[`${categoryId}-${subcategoryId}`] = selectedPrompt;
              } else {
                console.log(`No valid prompts in subcategory ${subcategoryId}`); // Log if no valid prompts in subcategory
              }
          });
      }
  });

  let outputDiv = document.getElementById("generatedPromptContainer");
  outputDiv.innerHTML = '';  // Clear previous output

  let table = document.createElement("table");

  let header = table.insertRow();
  let headerSubcategory = document.createElement("th");
  headerSubcategory.textContent = "Subcategory";
  let headerPrompt = document.createElement("th");
  headerPrompt.textContent = "Selected Prompt";
  header.appendChild(headerSubcategory);
  header.appendChild(headerPrompt);

  for (let key in selectedPrompts) {
    let promptText = selectedPrompts[key];
    let row = table.insertRow();

    let subcategoryCell = row.insertCell(0);
    subcategoryCell.textContent = key.split('-')[1] || key;

    let promptCell = row.insertCell(1);
    promptCell.textContent = promptText;
  }

  outputDiv.appendChild(table);
}


function weightedRandomChoices(prompts, probabilities) {
  let total = 0;

  // conver the probabilities to integers
  let probabilitiesArray = probabilities.map(str => +str);

  for (let i = 0; i < probabilitiesArray.length; i++) {
    total += probabilitiesArray[i];
  }

  for (let i = 0; i < probabilitiesArray.length; i++) {
    probabilitiesArray[i] /= total;
  }

  let randomNumber = Math.random();
  let cumulativeProbability = 0;

  for (let i = 0; i < prompts.length; i++) {
    cumulativeProbability += probabilitiesArray[i];
    if (randomNumber < cumulativeProbability) {
      return prompts[i];
    }
  }
};

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
