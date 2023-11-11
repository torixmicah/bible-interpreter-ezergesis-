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
  console.log(selectedText)

  fetch('https://3cajh2zyfi.ap-southeast-2.awsapprunner.com/interpret-text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: selectedText })
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

// Function to show the interpret button if text is selected
function showInterpretButton() {
  const selection = window.getSelection();
  console.log("test")
  console.log(selection.toString())
  const interpretButton = document.getElementById('interpretButton');
  if (selection.toString().length > 0) {
    console.log("made block")
    interpretButton.style.display = 'block';
  } else {
    interpretButton.style.display = 'none';
  }
}

// Event listener for text selection
function setupSelectionListener() {
  // Use 'mouseup' for desktop and 'touchend' for mobile
  const eventType = 'ontouchend' in document.documentElement ? 'touchend' : 'mouseup';
  document.addEventListener(eventType, showInterpretButton);
}

// Add click event listener to the interpret button
document.getElementById('interpretButton').addEventListener('click', function() {
  interpretText();
  // Optionally, hide the button after clicking
  // this.style.display = 'none';
});

// Call setup function to add the right event listener
setupSelectionListener();

// Optionally, hide the button if the user clicks or touches anywhere else on the screen
// document.addEventListener('click', function(e) {
//   if (e.target.id !== 'interpretButton') {
//     document.getElementById('interpretButton').style.display = 'none';
//   }
// })

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

// Toggling between local and production endpoints
const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://3cajh2zyfi.ap-southeast-2.awsapprunner.com';

// Then, when making a fetch request, use API_BASE_URL
fetch(`${API_BASE_URL}/fetch-passage`, { /* ... */ });
fetch(`${API_BASE_URL}/interpret-text`, { /* ... */ });