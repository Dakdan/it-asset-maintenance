const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzNSgpYNigJX7W-RUPq8SLN4e687pE55p72KsbM-nWFcPefKDhjzYAflsm78i42IW7qrw/exec";

/* ===============================
   Helper : เรียก Google Apps Script
================================ */
async function apiRequest(data) {
  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    return await res.json();
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch");
  }
}

/* ===============================
   Popup
================================ */
function showPopup(title, message) {
  document.getElementById("popup-title").innerText = title;
  document.getElementById("popup-message").innerText = message;
  document.getElementById("popup").style.display = "flex";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

/* ===============================
   Loader
================================ */
function showLoader(show) {
  document.getElementById("loader").style.display = show ? "flex" : "none";
}

/* ===============================
   Register
================================ */
async function handleRegister() {
  const USERID = document.getElementById("USERID").value.trim();
  const UserName = document.getElementById("UserName").value.trim();
  const UserSname = document.getElementById("UserSname").value.trim();
  const UserMail = document.getElementById("UserMail").value.trim();
  const UserTypeName = document.getElementById("UserTypeName").value;

  if (!USERID || !UserName || !UserSname || !UserMail) {
    showPopup("แจ้งเตือน", "กรุณากรอกข้อมูลให้ครบ");
    return;
  }

  showLoader(true);

  try {
    const result = await apiRequest({
      action: "register",
      USERID,
      UserName,
      UserSname,
      UserMail,
      UserTypeName
    });

    showLoader(false);

    if (result.status === "success") {
      showPopup("สำเร็จ", "ลงทะเบียนเรียบร้อยแล้ว");
    } else {
      showPopup("ผิดพลาด", result.message || "ไม่สามารถลงทะเบียนได้");
    }

  } catch (err) {
    showLoader(false);
    showPopup("ผิดพลาด", "ไม่สามารถเชื่อมต่อระบบได้");
  }
}
