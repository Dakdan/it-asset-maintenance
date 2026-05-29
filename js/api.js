
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwPk2LYTrUxUkEZmTuwrZ6vWtInLSbzTC7fscaKo7AENJ3cua0Nufl36OCFES3fqGw8hg/exec";

/* =========================
   CORE REQUEST
========================= */
async function apiRequest(payload) {

  try {

    const res = await fetch(SCRIPT_URL, {
      method: "POST",

      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },

      body: JSON.stringify(payload)
    });

    return await res.json();

  } catch (err) {

    return {
      status: false,
      message: err.message
    };
  }
}

/* =========================
   LOGIN API
========================= */
const api = {

  login: async (username, password) => {

    return await apiRequest({
      action: "login",
      username: username,
      password: password
    });

  }

};
```
