/* =========================
   CONFIG
========================= */
const api = 'https://script.google.com/macros/s/AKfycbzNSgpYNigJX7W-RUPq8SLN4e687pE55p72KsbM-nWFcPefKDhjzYAflsm78i42IW7qrw/exec';

/************** LOGIN **************/
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  fetch(api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'login',
      username,
      password
    })
  })
  .then(res => res.json())
  .then(res => {
    if (res.success) {
      alert('เข้าสู่ระบบสำเร็จ');
      console.log(res.data);
      // window.location = 'index.html';
    } else {
      alert(res.message);
    }
  })
  .catch(err => {
    console.error(err);
    alert('เชื่อมต่อ API ไม่ได้');
  });
});
