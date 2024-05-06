import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

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

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registration_form');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // يمنع إرسال النموذج

        // استخراج قيم الحقول
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // إنشاء حساب جديد باستخدام Firebase Authentication
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // تم التسجيل بنجاح
                const user = userCredential.user;
                // هنا يمكنك إضافة أي عمليات أخرى بعد التسجيل بنجاح، مثل توجيه المستخدم إلى صفحة البروفايل
                window.location.href = "profile.html";
            })
            .catch((error) => {
                // حدث خطأ أثناء التسجيل
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(errorMessage);
            });
    });
});
