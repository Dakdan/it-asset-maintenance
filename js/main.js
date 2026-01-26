// ================= CONFIG =================
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzNSgpYNigJX7W-RUPq8SLN4e687pE55p72KsbM-nWFcPefKDhjzYAflsm78i42IW7qrw/exec";

// ================= API =================
async function apiRequest(data) {
  const res = await fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

// ================= UI =================
function toggleLoader(show) {
  const el = document.getElementById("loader");
  if (el) el.style.display = show ? "flex" : "none";
}

function showPopup(msg, title = "แจ้งเตือน") {
  document.getElementById("popup-title").innerText = title;
  document.getElementById("popup-message").innerText = msg;
  document.getElementById("popup").style.display = "flex";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

// ================= LOGIN =================
async function handleLogin() {
  const email = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    showPopup("กรุณากรอก Email และ Password");
    return;
  }

  toggleLoader(true);

  try {
    const res = await apiRequest({
      action: "loginIT",
      email,
      password
    });

    if (res.success) {
      localStorage.setItem("it_session", JSON.stringify(res));
      location.href = "index.html";
    } else {
      showPopup("Email หรือ Password ไม่ถูกต้อง");
    }
  } catch {
    showPopup("ไม่สามารถเชื่อมต่อระบบได้");
  } finally {
    toggleLoader(false);
  }
}

// ================= REGISTER =================
async function handleRegister() {
  toggleLoader(true);

  try {
    const res = await apiRequest({
      action: "registerIT",
      USERID: USERID.value.trim(),
      UserTypeName: UserTypeName.value,
      UserName: UserName.value.trim(),
      UserSname: UserSname.value.trim(),
      UserMail: UserMail.value.trim()
    });

    if (res.success) {
      showPopup("สมัครสมาชิกสำเร็จ กรุณาตรวจสอบ Email", "สำเร็จ");
      setTimeout(() => location.href = "login.html", 1200);
    } else {
      showPopup("ลงทะเบียนไม่สำเร็จ");
    }
  } catch {
    showPopup("เชื่อมต่อระบบไม่ได้");
  } finally {
    toggleLoader(false);
  }
}
