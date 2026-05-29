
function getCurrentUser() {
    const user = localStorage.getItem("PM_USER");

    if (!user) {
        window.location.href = "login.html";
        return null;
    }

    return JSON.parse(user);
}

function logout() {
    localStorage.removeItem("PM_USER");
    window.location.href = "login.html";
}

