
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js'

    // If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
    import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-analytics.js'

    // Add Firebase products that you want to use
    import { getAuth } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js'
    import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js'
    import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

    // ...

    // TODO: Replace the following with your app's Firebase project configuration
    const firebaseConfig = {
      // ...
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
 const auth = getAuth();
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
</script>

