// public/script.js
document.addEventListener('DOMContentLoaded', () => {
  const inputPassage = document.getElementById('passage-input');
  const interpretButton = document.getElementById('interpretButton');

  inputPassage.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      // Prevent the default form submission if it's part of a form
      event.preventDefault();
      // Call the function that handles the search
      fetchPassage();
    }
  });
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
  // console.log(selectedText)

  fetch('https://3cajh2zyfi.ap-southeast-2.awsapprunner.com/interpret-text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: selectedText })
  })
    .then(response => response.json())
    .then(data => {
      // Display the interpretation in the designated area
      console.log(data.interpretation)
      const interpretationDisplay = document.getElementById('interpretation-text');
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
  // console.log("test")
  // console.log(selection.toString())
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

// // Add click event listener to the interpret button
// document.getElementById('interpretButton').addEventListener('click', function() {
//   interpretText();
//   // Optionally, hide the button after clicking
//   // this.style.display = 'none';
// });

// Call setup function to add the right event listener
setupSelectionListener();

// Optionally, hide the button if the user clicks or touches anywhere else on the screen
// document.addEventListener('click', function(e) {
//   if (e.target.id !== 'interpretButton') {
//     document.getElementById('interpretButton').style.display = 'none';
//   }
// })

// JavaScript to open the modal and make it draggable
document.getElementById('interpretButton').addEventListener('click', function() {
  // Open the modal
  document.getElementById('interpretation-display').style.display = 'block';
  
  // Get the modal text and update it with the interpretation
  // const modalText = document.getElementById('interpretation-text');
  // const selectedText = getSelectedText();
  // modalText.textContent = selectedText; // You'll want to replace this with the actual interpretation call
});

// Get the modal
var modal = document.getElementById('interpretation-display');

// Get the <span> element that closes the modal
var closeButton = document.getElementsByClassName("close-button")[0];

// When the user clicks on <span> (x), close the modal
closeButton.onclick = function() {
  modal.style.display = "none";
}
//-------------------------------OLD DRAGGABLE CODE------------------------------------------------------------
// Make the modal draggable on desktop and mobile
// function makeModalDraggable() {
//   const modal = document.getElementById('interpretation-display');
//   const header = modal.querySelector('.modal-header');
//   var active = false;
//   var currentX;
//   var currentY;
//   var initialX;
//   var initialY;
//   var xOffset = 0;
//   var yOffset = 0;

//   header.addEventListener('mousedown', dragStart, false);
//   header.addEventListener('mouseup', dragEnd, false);
//   header.addEventListener('mousemove', drag, false);

//   // For touch devices
//   header.addEventListener('touchstart', dragStart, false);
//   header.addEventListener('touchend', dragEnd, false);
//   header.addEventListener('touchmove', drag, false);

//   function dragStart(e) {
//     if (e.type === 'touchstart') {
//       initialX = e.touches[0].clientX - xOffset;
//       initialY = e.touches[0].clientY - yOffset;
//     } else {
//       initialX = e.clientX - xOffset;
//       initialY = e.clientY - yOffset;
//     }

//     if (e.target === modalContent) {
//       active = true;
//     }
//   }

//   function dragEnd(e) {
//     initialX = currentX;
//     initialY = currentY;
//     active = false;
//   }

//   function drag(e) {
//     if (active) {
    
//       e.preventDefault();
    
//       if (e.type === 'touchmove') {
//         currentX = e.touches[0].clientX - initialX;
//         currentY = e.touches[0].clientY - initialY;
//       } else {
//         currentX = e.clientX - initialX;
//         currentY = e.clientY - initialY;
//       }

//       xOffset = currentX;
//       yOffset = currentY;

//       setTranslate(currentX, currentY, modalContent);
//     }
//   }

//   function setTranslate(xPos, yPos, el) {
//     el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
//   }
// }

// // Call this function to make the modal draggable
// makeModalDraggable();
//-------------------------------------------------------------------------------------------
// Make the modal draggable on desktop and touch devices
const header = modal.querySelector('.modal-header');
let isDragging = false;
let activeEvent = '';
let transform = { x: 0, y: 0 };

// Unified function to handle starting of dragging event
function dragStart(e) {
  isDragging = true;
  activeEvent = e.type;

  const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
  const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
  
  const rect = modal.getBoundingClientRect();
  transform.x = clientX - rect.left;
  transform.y = clientY - rect.top;
}

// Unified function to handle dragging
function dragging(e) {
  if (isDragging) {
    const clientX = activeEvent.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const clientY = activeEvent.includes('mouse') ? e.clientY : e.touches[0].clientY;

    modal.style.left = `${clientX - transform.x}px`;
    modal.style.top = `${clientY - transform.y}px`;
  }
}

// Function to stop dragging
function dragEnd() {
  isDragging = false;
}

// Adding mouse event listeners for dragging on desktop
header.addEventListener('mousedown', dragStart);
document.addEventListener('mousemove', dragging);
document.addEventListener('mouseup', dragEnd);

// Adding touch event listeners for dragging on mobile devices
header.addEventListener('touchstart', dragStart);
document.addEventListener('touchmove', dragging);
document.addEventListener('touchend', dragEnd);

// Preventing unwanted scrolling on iOS devices while dragging the modal
header.addEventListener('touchmove', (e) => {
  e.preventDefault();
}, { passive: false });


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