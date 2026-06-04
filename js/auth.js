document.addEventListener('DOMContentLoaded', () => {
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Переключение табов
    tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    });

    tabRegister.addEventListener('click', () => {
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    });

    // Обработка регистрации
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;

        if(password.length < 6) {
            alert("Пароль должен содержать минимум 6 знаков!");
            return;
        }

        let users = JSON.parse(localStorage.getItem('kz_users_db')) || [];
        if (users.find(u => u.email === email)) {
            alert("Пользователь с таким email уже зарегистрирован!");
            return;
        }

        const newUser = new User(name, email, password);
        users.push(newUser);
        localStorage.setItem('kz_users_db', JSON.stringify(users));

        alert("Регистрация успешна! Теперь выполните вход.");
        tabLogin.click();
    });

    // Обработка входа
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        const users = JSON.parse(localStorage.getItem('kz_users_db')) || [];
        const foundData = users.find(u => u.email === email);

        if (!foundData) {
            alert("Пользователь не найден.");
            return;
        }

        // Воссоздаем экземпляр для проверки пароля через метод класса ООП
        const userObj = new User(foundData.name, foundData.email, foundData.password);

        if (userObj.checkPassword(password)) {
            localStorage.setItem('kz_current_user', JSON.stringify({ name: userObj.name, email: userObj.email }));
            window.location.href = 'index.html';
        } else {
            alert("Неверный пароль.");
        }
    });
});