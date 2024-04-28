import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "Your-API-Key",
    authDomain: "Your-Auth-Domain",
    projectId: "Your-Project-Id",
    storageBucket: "Your-Storage-Bucket",
    messagingSenderId: "Your-Messaging-Sender-Id",
    appId: "Your-App-Id",
    measurementId: "Your-Measurement-Id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Listen for the registration form submission event
const registrationForm = document.getElementById('registration_form');
registrationForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phoneNumber = document.getElementById('phone').value;

    // Use Firebase SDK to create a new account
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Handle successful registration
            console.log("User registered successfully:", userCredential);
            // Redirect user to their profile page or any other page
         window.location.href = 'verification_sent.html';
        })
        .catch((error) => {
            // Handle errors
            console.error("Error registering user:", error);
        });
});
