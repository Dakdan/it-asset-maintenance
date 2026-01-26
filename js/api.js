const API =
  "https://script.google.com/macros/s/AKfycbzNSgpYNigJX7W-RUPq8SLN4e687pE55p72KsbM-nWFcPefKDhjzYAflsm78i42IW7qrw/exec";

function apiGet(action) {
  return fetch(`${API}?action=${action}`).then(r => r.json());
}

function apiPost(data) {
  return fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(r => r.json());
}
