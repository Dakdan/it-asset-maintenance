document.getElementById("loginForm").addEventListener("submit", async e => {
  e.preventDefault();

  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  const url = `${API_URL}?action=login&username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}&callback=cb`;

  window.cb = res => {
    if (res.success) {
      document.getElementById("msg").innerText = "เข้าสู่ระบบสำเร็จ";
    } else {
      document.getElementById("msg").innerText = "ไม่พบผู้ใช้";
    }
  };

  const s = document.createElement("script");
  s.src = url;
  document.body.appendChild(s);
});
