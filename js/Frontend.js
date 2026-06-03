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
  const displayElement = document.getElementById("userNameDisplay");
  const authBtn = document.getElementById("authBtn"); // ต้องมั่นใจว่าใน HTML ใส่ id="authBtn"

  if (user) {
    // --- กรณี Login แล้ว ---
    if (displayElement) {
      displayElement.innerText = `ผู้ใช้งาน: ${user.fullname || user.username || 'Unknown'}`;
    }
    if (authBtn) {
      authBtn.innerText = "ออกจากระบบ";
      authBtn.onclick = logout; // คลิกแล้ว Logout
      // authBtn.classList.add('btn-logout'); // ถ้าอยากเปลี่ยนสีปุ่มผ่าน CSS
    }
  } else {
    // --- กรณี Guest (ยังไม่ Login) ---
    if (displayElement) {
      displayElement.innerText = "";
    }
    if (authBtn) {
      authBtn.innerText = "เข้าสู่ระบบ";
      authBtn.onclick = function() {
        window.location.href = "login.html"; // คลิกแล้วไปหน้า Login
      };
    }
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
