/* =========================
   CONFIG
========================= */
const SESSION_KEY = "it_session";

/* =========================
   UI HELPER
========================= */
function showLoader() {
  const el = document.getElementById("loader");
  if (el) el.style.display = "flex";
}

function hideLoader() {
  const el = document.getElementById("loader");
  if (el) el.style.display = "none";
}

function showPopup(title, message) {
  document.getElementById("popup-title").innerText = title;
  document.getElementById("popup-message").innerText = message;
  document.getElementById("popup").style.display = "flex";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

/* =========================
   SESSION
========================= */
function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function getSession() {
  const s = localStorage.getItem(SESSION_KEY);
  return s ? JSON.parse(s) : null;
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/* =========================
   LOGIN
========================= */
async function handleLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !password) {
    showPopup("แจ้งเตือน", "กรุณากรอกข้อมูลให้ครบ");
    return;
  }

  showLoader();

  try {
    const res = await api.login(username, password);

    if (!res.success) {
      hideLoader();
      showPopup("เข้าสู่ระบบไม่สำเร็จ", res.message || "ข้อมูลไม่ถูกต้อง");
      return;
    }

    // 🔐 login สำเร็จ
    saveSession(res.user);

    hideLoader();
    location.href = "./index.html";

  } catch (err) {
    hideLoader();
    showPopup("ผิดพลาด", err.message);
  }
}

/* =========================
   REGISTER
========================= */
async function handleRegister() {
  const data = {
    USERID: document.getElementById("USERID").value.trim(),
    UserName: document.getElementById("UserName").value.trim(),
    UserSname: document.getElementById("UserSname").value.trim(),
    UserMail: document.getElementById("UserMail").value.trim(),
    UserTypeName: document.getElementById("UserTypeName").value
  };

  if (!data.USERID || !data.UserName || !data.UserSname || !data.UserMail) {
    showPopup("แจ้งเตือน", "กรุณากรอกข้อมูลให้ครบ");
    return;
  }

  showLoader();

  try {
    const res = await api.register(data);

    hideLoader();

    if (!res.success) {
      showPopup("สมัครไม่สำเร็จ", res.message || "เกิดข้อผิดพลาด");
      return;
    }

    showPopup(
      "สมัครสำเร็จ",
      "ระบบได้ส่งรหัสผ่านเริ่มต้นไปที่ Email แล้ว"
    );

    setTimeout(() => {
      location.href = "./login.html";
    }, 1500);

  } catch (err) {
    hideLoader();
    showPopup("ผิดพลาด", err.message);
  }
}

/* =========================
   AUTO LOGIN (INDEX)
========================= */
function checkLogin() {
  const session = getSession();
  if (!session) {
    location.href = "./login.html";
  }
}

/* =========================
   LOGOUT
========================= */
function logout() {
  clearSession();
  location.href = "./login.html";
}
