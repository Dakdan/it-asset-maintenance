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
  const username = document.getElementById("username")?.value.trim();
  const password = document.getElementById("password")?.value.trim();

  if (!username || !password) {
    showPopup("กรุณากรอก Username และ Password");
    return;
  }

  toggleLoader(true);

  try {
    const res = await apiRequest({
      action: "login",        // ✅ ตรงกับ Code.gs
      USERID: username,       // ✅ ตรง column
      UserPW: password        // ✅ ตรง column
    });

    if (res.success) {
      localStorage.setItem("it_session", JSON.stringify(res.data));
      location.href = "index.html";
    } else {
      showPopup(res.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
  } catch (e) {
    showPopup("ไม่สามารถเชื่อมต่อระบบได้");
  } finally {
    toggleLoader(false);
  }
}

// ================= REGISTER =================
async function handleRegister() {
  const data = {
    action: "registerIT",
    USERID: USERID.value.trim(),
    UserTypeName: UserTypeName.value,
    UserName: UserName.value.trim(),
    UserSname: UserSname.value.trim(),
    UserMail: UserMail.value.trim()
  };

  if (!data.USERID || !data.UserName || !data.UserMail) {
    showPopup("กรุณากรอกข้อมูลให้ครบ");
    return;
  }

  toggleLoader(true);

  try {
    const res = await apiRequest(data);

    if (res.success) {
      showPopup("สมัครสมาชิกสำเร็จ กรุณาตรวจสอบ Email", "สำเร็จ");
      setTimeout(() => location.href = "login.html", 1200);
    } else {
      showPopup(res.message || "ลงทะเบียนไม่สำเร็จ");
    }
  } catch {
    showPopup("เชื่อมต่อระบบไม่ได้");
  } finally {
    toggleLoader(false);
  }
}
