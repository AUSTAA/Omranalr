const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = registerForm['email'].value;
    const password = registerForm['password'].value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // تسجيل الدخول بنجاح، يمكنك إجراء إجراءات إضافية هنا
            console.log('User registered successfully!');
        })
        .catch((error) => {
            // حدث خطأ أثناء تسجيل الدخول
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorMessage);
        });
});
