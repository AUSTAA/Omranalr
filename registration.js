
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js'
    // Add Firebase products that you want to use
    import { getAuth , createUserWithEmailAndPassword  } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js'
    import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js'


    // TODO: Replace the following with your app's Firebase project configuration
    const firebaseConfig = {
    apiKey: "AIzaSyB7YJhtaefEPc9NMzhTBjQC06WmSEja0xc",
    authDomain: "omran-16f44.firebaseapp.com",
    databaseURL: "https://omran-16f44-default-rtdb.firebaseio.com",
    projectId: "omran-16f44",
    storageBucket: "omran-16f44.appspot.com",
    messagingSenderId: "598982209417",
    appId: "1:598982209417:web:dc9cbddd485a1ea52bbb58",
    measurementId: "G-PGZJ0T555G"
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
const auth = getAuth();
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    // ...
  })
    document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registration_form');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // يمنع إرسال النموذج

        // استخراج قيم الحقول
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // هنا يمكنك إجراء العمليات اللازمة للتحقق من صحة البيانات ومعالجتها

        // توجيه المستخدم إلى صفحة البروفايل بعد التسجيل
        window.location.href = "profile.html";
    });
});
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
</script>

