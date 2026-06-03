/**
 * Frontend.js - ระบบจัดการ Auth และ UI เบื้องต้น
 */

function getCurrentUser() {
    try {
        const user = localStorage.getItem("PM_USER");
        return user ? JSON.parse(user) : null;
    } catch (e) {
        return null;
    }
}

function requireLogin() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = "login.html";
        return false;
    }
    return true;
}

function logout() {
    localStorage.removeItem("PM_USER");
    window.location.href = "login.html";
}

function updateAuthUI() {
    const user = getCurrentUser();
    const displayElement = document.getElementById("userNameDisplay");
    const authBtn = document.getElementById("authBtn");

    if (user) {
        if (displayElement) {
            // ดึง fullname หรือ username มาแสดง
            displayElement.innerText = `ผู้ใช้งาน: ${user.fullname || user.username || "Unknown"}`;
        }
        if (authBtn) {
            authBtn.innerText = "ออกจากระบบ";
            authBtn.onclick = logout;
        }
    } else {
        if (displayElement) displayElement.innerText = "";
        if (authBtn) {
            authBtn.innerText = "เข้าสู่ระบบ";
            authBtn.onclick = () => window.location.href = "login.html";
        }
    }
}

// ใช้ DOMContentLoaded หรือ load เพื่อเริ่มการทำงาน
document.addEventListener('DOMContentLoaded', () => {
    // เช็คว่าหน้าปัจจุบันไม่ใช่หน้า login
    const isLoginPage = window.location.pathname.endsWith("login.html");

    if (!isLoginPage) {
        if (requireLogin()) {
            updateAuthUI();
            if (typeof loadAssetHistoryData === "function") {
                loadAssetHistoryData();
            }
        }
    } else {
        // ถ้าอยู่หน้า Login แต่ดันมี User แล้ว อาจจะ Redirect ไปหน้าหลักเลยก็ได้ (Optional)
        if (getCurrentUser()) {
             // window.location.href = "index.html"; 
        }
    }
});
