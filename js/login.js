// login.js
document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("loginBtn");
  if (!btn) return;

  btn.addEventListener("click", async () => {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      App.Modal("ข้อมูลไม่ครบ", "กรอกให้ครบ");
      return;
    }

    App.Loader.show();

    try {
      const result = await Api.login(username, password);

      App.Loader.hide();

      if (result.success) {
        App.Auth.set(result.user);
        window.location.href = "index.html";
      } else {
        App.Modal("เข้าสู่ระบบไม่สำเร็จ", result.message);
      }

    } catch (err) {
      App.Loader.hide();
      App.Modal("Error", "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    }

  });

});
