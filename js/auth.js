
function getCurrentUser() {

  return JSON.parse(
    localStorage.getItem("PM_USER")
  );

}

function requireLogin() {

  const user = getCurrentUser();

  if (!user) {

    window.location.href = "login.html";

    return false;
  }

  return true;
}

function logout() {

  localStorage.removeItem("PM_USER");

  window.location.href = "login.html";
}


