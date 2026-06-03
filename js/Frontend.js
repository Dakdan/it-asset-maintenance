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

// ฟังก์ชันสำหรับแสดงผลชื่อผู้ใช้บน UI
function displayUserInfo() {
    const user = getCurrentUser();
    const displayElement = document.getElementById("userNameDisplay");
    
    if (user && displayElement) {
        // สมมติว่าโครงสร้าง JSON ของคุณมี field ชื่อ 'fullname' หรือ 'username'
        // ปรับตาม key จริงใน database ของคุณ เช่น user.name หรือ user.displayName
        displayElement.innerText = `ผู้ใช้งาน: ${user.fullname || user.username || 'Unknown'}`;
    }
}

// รวมการทำงานเมื่อโหลดหน้าเว็บ
window.onload = function() {
    if (requireLogin()) {
        displayUserInfo(); // แสดงชื่อผู้ใช้
        
        // ถ้ามีฟังก์ชันอื่นๆ ให้เรียกต่อจากนี้
        if (typeof loadAssetHistoryData === "function") {
            loadAssetHistoryData();
        }
    }
};
// ตัวอย่างการใช้งานในหน้าแสดงประวัติ (Dashboard/History)
/*
window.onload = function() {
  if (requireLogin()) {
    // โหลดข้อมูล Dashboard
    loadAssetHistoryData(); 
  }
};
*/
