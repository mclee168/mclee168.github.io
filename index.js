// Import stylesheets
import "./style.css";
// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

import * as firebaseui from "firebaseui";

// Document elements
const startRsvpButton = document.getElementById("startRsvp");
const guestbookContainer = document.getElementById("guestbook-container");

const form = document.getElementById("leave-message");
const input = document.getElementById("message");
const guestbook = document.getElementById("guestbook");
const numberAttending = document.getElementById("number-attending");
const rsvpYes = document.getElementById("rsvp-yes");
const rsvpNo = document.getElementById("rsvp-no");

var rsvpListener = null;
var guestbookListener = null;

async function main() {
  // Add Firebase project configuration object here
  // var firebaseConfig = {};
  var firebaseConfig = {
    apiKey: "AIzaSyDLTe8RLSG_l8O-JAAFlI3nZYPbxmVCTnM",
    authDomain: "hello-monkey-b81ee.firebaseapp.com",
    databaseURL: "https://hello-monkey-b81ee-default-rtdb.firebaseio.com",
    projectId: "hello-monkey-b81ee",
    storageBucket: "hello-monkey-b81ee.appspot.com",
    messagingSenderId: "937202408935",
    appId: "1:937202408935:web:0bedc3c71ccda4b68f7142",
    measurementId: "G-FRDV4YCHS1"
  };
  firebase.initializeApp(firebaseConfig);

  // FirebaseUI config
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      // Email / Password Provider.
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // Handle sign-in.
        // Return false to avoid redirect.
        return false;
      }
    }
  };

  const ui = new firebaseui.auth.AuthUI(firebase.auth());
 // ...
// Called when the user clicks the RSVP button
startRsvpButton.addEventListener("click",
() => {
   if (firebase.auth().currentUser) {
     // User is signed in; allows user to sign out
     firebase.auth().signOut();
   } else {
     // No user is signed in; allows user to sign in
     ui.start("#firebaseui-auth-container", uiConfig);
   }
});

// Listen to the current Auth state
firebase.auth().onAuthStateChanged((user)=> {
  if (user) {
    startRsvpButton.textContent = "LOGOUT"
    // Show guestbook to logged-in users
    bankContainer.style.display = "block";
  }
  else {
    startRsvpButton.textContent = "RSVP"
   // Hide guestbook for non-logged-in users
   bankContainer.style.display = "none";
  }
});

// ..
// Listen to the form submission
form.addEventListener("submit", (e) => {
  // Prevent the default form redirect
  e.preventDefault();
  // Write a new message to the database collection "bank"
  firebase.firestore().collection("bank").add({
    thing: document.getElementById("thing").value,
    change: document.getElementById("change").value,
    timestamp: Date.now(),
    name: firebase.auth().currentUser.displayName,
    userId: firebase.auth().currentUser.uid
  })
  // clear message input field
  //input.value = ""; 
  document.getElementById("thing").value = "";
  document.getElementById("change").value = "";

  // Return false to avoid redirect
  return false;
 });

 // ...
// Create query for messages
firebase.firestore().collection("bank")
.orderBy("timestamp","desc")
.onSnapshot((snaps) => {
 // Reset page
 bank.innerHTML = "";
 // Loop through documents in database
 snaps.forEach((doc) => {
   // Create an HTML entry for each document and add it to the chat
   const entry = document.createElement("p");
   entry.textContent = doc.data().name + ": " + doc.data().thing
    + " " + doc.data().change;
   bank.appendChild(entry);
 });
});
}


main();
