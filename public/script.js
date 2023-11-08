// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const fetchButton = document.getElementById('fetchButton');
    const interpretButton = document.getElementById('interpretButton');
  
    fetchButton.addEventListener('click', fetchPassage);
    interpretButton.addEventListener('click', interpretText);
  });
  
  function fetchPassage() {
    const passageInput = document.getElementById('passage-input'); // Make sure your input has this ID
  const [book, chapter, verse] = passageInput.value.split(/\s+|\:|\./); // Split input value to get book, chapter and verse
  const passageDisplay = document.getElementById('passage-display'); // Display area for the passage
  
  fetch(`/fetch-passage?book=${encodeURIComponent(book)}&chapter=${encodeURIComponent(chapter)}&verse=${encodeURIComponent(verse || '')}`)
    .then(response => response.json())
    .then(data => {
      passageDisplay.innerHTML = data.passageText; // Assuming the server responds with a "passageText" field
    })
    .catch(error => {
      console.error('Error fetching passage:', error);
      passageDisplay.textContent = 'Error fetching passage.';
    });
  }
  
  function interpretText() {
    const selectedText = getSelectedText();
    const denomination = getSelectedDenomination();
    console.log(selectedText)
    console.log(denomination)
    
    fetch('/interpret-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: selectedText, denomination: denomination })
    })
    .then(response => response.json())
    .then(data => {
      // Display the interpretation in the designated area
      const interpretationDisplay = document.getElementById('interpretation-display');
      interpretationDisplay.textContent = data.interpretation;
    })
    .catch(error => console.error('Error:', error));
  }
  
  function getSelectedText() {
    // Use window.getSelection to get the user-selected text on the webpage
    if (window.getSelection) {
      return window.getSelection().toString();
    } else if (document.selection && document.selection.type !== "Control") {
      return document.selection.createRange().text;
    }
    return ''; // Return empty string if no text is selected
  }
  
  function getSelectedDenomination() {
    // Assuming you have a select element with id="denomination-select" for the user to choose a denomination
    const denominationSelect = document.getElementById('denomination-select');
    return denominationSelect.value; // Return the selected option value
  }