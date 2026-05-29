
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwVwQCHnNmRBS2rh0eOFjr8E1HQmgUZaflQeS2T-N66pYKwWkFBaNv-FBvqyeh3b1lr/exec";

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

const api = {

  login: async (username, password) => {

    return await apiRequest({
      action: "login",
      username,
      password
    });

  }

};

