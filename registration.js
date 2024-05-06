document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registration_form');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // يمنع إرسال النموذج

        // استخراج قيم الحقول
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // إنشاء حساب جديد باستخدام Firebase Authentication
        const auth = firebase.auth();
        auth.createUserWithEmailAndPassword(email, password)
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
