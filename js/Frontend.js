// เก็บข้อมูล User ไว้ใน localStorage
function getCurrentUser() {
  const user = localStorage.getItem("PM_USER");
  return user ? JSON.parse(user) : null;
}

// ตรวจสอบสิทธิ์ก่อนเข้าถึงหน้าเว็บ
function requireLogin() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

// ออกจากระบบ
function logout() {
  localStorage.removeItem("PM_USER");
  window.location.href = "login.html";
}

// ตัวอย่างการใช้งานในหน้าแสดงประวัติ (Dashboard/History)
/*
window.onload = function() {
  if (requireLogin()) {
    // โหลดข้อมูล Dashboard
    loadAssetHistoryData(); 
  }
};
*/
