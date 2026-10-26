// Requisito extra

function setCookieTema(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookieTema(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length);
        }
    }
    return null;
}

const mudarTema = document.getElementById('mudar-tema');

mudarTema.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        setCookieTema('theme', 'dark',365);
        document.querySelector("#mudar-tema").innerHTML = "<i class=\"fa-solid fa-moon\"></i>";
    } else {
        setCookieTema('theme', 'light',365);
        document.querySelector("#mudar-tema").innerHTML = "<i class=\"fa-solid fa-sun\"></i>";
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = getCookieTema('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.querySelector("#mudar-tema").innerHTML = "<i class=\"fa-solid fa-moon\"></i>";
    }
});
