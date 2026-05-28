const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwPk2LYTrUxUkEZmTuwrZ6vWtInLSbzTC7fscaKo7AENJ3cua0Nufl36OCFES3fqGw8hg/exec";

/* =========================
   CORE REQUEST
========================= */
async function apiRequest(payload) {
  const res = await fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return res.json();
}

/* =========================
   API WRAPPER (สำคัญมาก)
========================= */
const api = {

  login: (username, password) => {
    return apiRequest({
      action: "login",
      username,
      password
    });
  },

  register: (data) => {
    return apiRequest({
      action: "register",
      ...data
    });
  },

  verifyEmail: (userid, code) => {
    return apiRequest({
      action: "verifyEmail",
      userid,
      code
    });
  }

};
