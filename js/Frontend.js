// 1. เก็บข้อมูล User ไว้ใน localStorage
function getCurrentUser() {
  const user = localStorage.getItem("PM_USER");
  return user ? JSON.parse(user) : null;
}

// 2. ตรวจสอบสิทธิ์ก่อนเข้าถึงหน้าเว็บ (สำหรับหน้าที่ไม่อนุญาตให้ Guest เข้า)
function requireLogin() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

// 3. ออกจากระบบ
function logout() {
  localStorage.removeItem("PM_USER");
  window.location.href = "login.html";
}

// 4. ฟังก์ชันแสดงชื่อผู้ใช้ และ สลับปุ่ม Login/Logout (จุดสำคัญ)
function updateAuthUI() {
    const user = getCurrentUser();
    console.log("Current User Data:", user); // ดูค่าใน Console (F12)

    const displayElement = document.getElementById("userNameDisplay");
    const authBtn = document.getElementById("authBtn");

    if (user && displayElement) {
        // ต้องมั่นใจว่า user.fullname มีค่าจริงๆ
        displayElement.innerText = "ผู้ใช้งาน: " + (user.fullname || user.username || "ไม่มีชื่อ");
        if (authBtn) authBtn.innerText = "ออกจากระบบ";
    } else {
        if (displayElement) displayElement.innerText = "";
        if (authBtn) authBtn.innerText = "เข้าสู่ระบบ";
    }
}

// 5. รวมการทำงานเมื่อโหลดหน้าเว็บ
window.onload = function() {
  // ตรวจสอบว่าหน้านี้ต้องการการล็อคอินหรือไม่ (เช็คจาก URL หรือความเหมาะสม)
  // หากเป็นหน้า Dashboard หรือหน้าจัดการข้อมูล ให้ใช้ requireLogin()
  const isPrivatePage = !window.location.pathname.includes("login.html"); 

  if (isPrivatePage) {
      if (requireLogin()) {
          updateAuthUI();
          if (typeof loadAssetHistoryData === "function") {
              loadAssetHistoryData();
          }
      }
  } else {
      // หน้าสาธารณะ (ถ้ามี) ให้แสดงปุ่ม Login ตามปกติ
      updateAuthUI();
  }
};
