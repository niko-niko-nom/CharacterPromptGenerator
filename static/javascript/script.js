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
        
          let selectablePrompts = selectedSubcategory.querySelectorAll(".selectablePrompt:not(.ghost)");
          let prompts = Array.from(selectablePrompts).map(prompt => prompt.id);
        
          if (prompts.length > 0) {
            // Select probability divs only for the prompts within the selected subcategory
            const probabilityDivs = selectedSubcategory.querySelectorAll(`.probability_${selectedSubcategory.querySelector(".subcategoryTitle").id.trim().replace(/\s/g, '')}`);
            
            const probabilities = [];
            
            probabilityDivs.forEach(div => {
              probabilities.push(div.innerHTML);
            });
        
            let selectedPrompt = weightedRandomChoices(prompts, probabilities);
            selectedPrompts[categoryId] = selectedPrompt;
          }
        } else {
          console.log(`No valid prompts available in category: ${categoryName}`);
        }
      } else {
          // For regular categories: pick one prompt from each subcategory
          let subcategories = document.querySelectorAll(`.subcategoryColumn[data-category='${categoryId}']`);
          subcategories.forEach(function(subcategory) {
              let subcategoryId = subcategory.querySelector(".subcategoryTitle").id;

              let selectablePrompts = subcategory.querySelectorAll(".selectablePrompt:not(.ghost)");
              let prompts = Array.from(selectablePrompts).map(prompt => prompt.id);

              if (prompts.length > 0) {
                const probabilityDivs = document.querySelectorAll(`.probability_${subcategoryId.trim().replace(/\s/g, '')}`);

                const probabilities = [];
                probabilityDivs.forEach(div => {
                  probabilities.push(div.innerHTML);
                });

                let selectedPrompt = weightedRandomChoices(prompts, probabilities);
                selectedPrompts[`${categoryId}-${subcategoryId}`] = selectedPrompt;
              } else {
                console.log(`No valid prompts in subcategory ${subcategoryId}`);
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

    // Get the explanation from the selectablePrompt's data attribute
    let explanation = document.getElementById(promptText).getAttribute('data-explanation');

    // Create a documentFragment to hold the prompt text and tooltip
    let fragment = document.createDocumentFragment();

    // Create the prompt text element
    let promptTextNode = document.createTextNode(promptText);
    fragment.appendChild(promptTextNode);  // Append the prompt text first

    // Add the tooltip container for each prompt
    let tooltipContainer = document.createElement('div');
    tooltipContainer.classList.add('tooltipIcon');
    
    // Add the SVG icon
    let svgIcon = `
      <svg fill="#000000" width="800px" height="800px" viewBox="0 0 400 400" id="Search" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">

      <g id="XMLID_14_">

      <polygon id="XMLID_15_" points="160,26.7 186.7,26.7 213.3,26.7 213.3,0 186.7,0 160,0 133.3,0 106.7,0 106.7,26.7 133.3,26.7  "/>

      <polygon id="XMLID_126_" points="106.7,53.3 106.7,26.7 80,26.7 53.3,26.7 53.3,53.3 80,53.3  "/>

      <polygon id="XMLID_127_" points="240,53.3 266.7,53.3 266.7,26.7 240,26.7 213.3,26.7 213.3,53.3  "/>

      <polygon id="XMLID_128_" points="53.3,80 53.3,53.3 26.7,53.3 26.7,80 26.7,106.7 53.3,106.7  "/>

      <polygon id="XMLID_130_" points="266.7,106.7 293.3,106.7 293.3,80 293.3,53.3 266.7,53.3 266.7,80  "/>

      <rect height="26.7" id="XMLID_131_" width="26.7" x="80" y="106.7"/>

      <rect height="26.7" id="XMLID_132_" width="26.7" x="106.7" y="80"/>

      <polygon id="XMLID_133_" points="293.3,160 293.3,186.7 293.3,213.3 320,213.3 320,186.7 320,160 320,133.3 320,106.7 293.3,106.7    293.3,133.3  "/>

      <polygon id="XMLID_134_" points="26.7,160 26.7,133.3 26.7,106.7 0,106.7 0,133.3 0,160 0,186.7 0,213.3 26.7,213.3 26.7,186.7     "/>

      <polygon id="XMLID_135_" points="53.3,213.3 26.7,213.3 26.7,240 26.7,266.7 53.3,266.7 53.3,240  "/>

      <polygon id="XMLID_136_" points="293.3,240 293.3,213.3 266.7,213.3 266.7,240 266.7,266.7 293.3,266.7  "/>

      <polygon id="XMLID_137_" points="80,266.7 53.3,266.7 53.3,293.3 80,293.3 106.7,293.3 106.7,266.7  "/>

      <polygon id="XMLID_138_" points="213.3,266.7 213.3,293.3 240,293.3 266.7,293.3 266.7,266.7 240,266.7  "/>

      <polygon id="XMLID_139_" points="160,293.3 133.3,293.3 106.7,293.3 106.7,320 133.3,320 160,320 186.7,320 213.3,320 213.3,293.3    186.7,293.3  "/>

      <rect height="26.7" id="XMLID_140_" width="26.7" x="293.3" y="293.3"/>

      <rect height="26.7" id="XMLID_141_" width="26.7" x="320" y="320"/>

      <rect height="26.7" id="XMLID_142_" width="26.7" x="346.7" y="346.7"/>

      <rect height="26.7" id="XMLID_143_" width="26.7" x="373.3" y="373.3"/>

      </g>

      </svg>
      `;
      tooltipContainer.innerHTML = svgIcon;
  
      // Add the tooltip text
      let tooltipText = document.createElement('span');
      tooltipText.classList.add('tooltipText');
      tooltipText.textContent = explanation || "No explanation available";  // Set the explanation
      tooltipContainer.appendChild(tooltipText);
  
      // Append the tooltip to the fragment
      fragment.appendChild(tooltipContainer);
  
      // Append the fragment to the prompt cell
      promptCell.appendChild(fragment);
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
