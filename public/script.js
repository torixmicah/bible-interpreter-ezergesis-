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

  fetch(`https://3cajh2zyfi.ap-southeast-2.awsapprunner.com/fetch-passage?book=${encodeURIComponent(book)}&chapter=${encodeURIComponent(chapter)}&verse=${encodeURIComponent(verse || '')}`)
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

  fetch('https://3cajh2zyfi.ap-southeast-2.awsapprunner.com/interpret-text', {
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

// Installation button for phone
let deferredPrompt;
const addToHomeScreenButton = document.getElementById('addToHomeScreen');



window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to show the Add to Home Screen button
  addToHomeScreenButton.style.display = 'block';
});

addToHomeScreenButton.addEventListener('click', () => {
  // Hide the button as we are about to show the prompt
  addToHomeScreenButton.style.display = 'none';
  // Show the prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the Add to Home Screen prompt');
    } else {
      console.log('User dismissed the Add to Home Screen prompt');
    }
    deferredPrompt = null;
  });
});