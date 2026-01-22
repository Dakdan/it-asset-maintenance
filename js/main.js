// *** เปลี่ยน URL เป็นของท่าน ***
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzNSgpYNigJX7W-RUPq8SLN4e687pE55p72KsbM-nWFcPefKDhjzYAflsm78i42IW7qrw/exec"; 

// 1. ฟังก์ชันเช็คการล็อกอิน (เรียกใช้ทุกหน้า)
function checkLogin() {
    const session = localStorage.getItem('it_session');
    const currentPage = window.location.pathname.split("/").pop();

    if (session) {
        // ถ้าล็อกอินแล้ว แต่อยู่หน้า login.html หรือ register.html ให้ไปหน้าหลัก
        if (currentPage === 'login.html' || currentPage === 'register.html' || currentPage === '') {
            window.location.replace('index.html');
        }
    } else {
        // ถ้ายังไม่ได้ล็อกอิน และไม่ได้อยู่หน้า login/register ให้เด้งไปหน้า login
        if (currentPage !== 'login.html' && currentPage !== 'register.html') {
            window.location.replace('login.html');
        }
    }
}

// 2. ฟังก์ชันล็อกอิน
async function handleLogin(username, password) {
    toggleLoader(true);
    try {
        const res = await apiRequest({
            action: 'login',
            username: username,
            password: password
        }, 'POST');

        if (res.success) {
            // *** หัวใจสำคัญ: บันทึกข้อมูลลงเครื่องเพื่อ "ไม่ต้องลงชื่อบ่อยๆ" ***
            localStorage.setItem('it_session', JSON.stringify(res.userData));
            window.location.replace('index.html');
        } else {
            alert(res.error || "Username หรือ Password ไม่ถูกต้อง");
        }
    } catch (e) {
        alert("การเชื่อมต่อเซิร์ฟเวอร์ล้มเหลว");
    } finally {
        toggleLoader(false);
    }
}

// 3. ฟังก์ชัน Logout (สำหรับปุ่มออกระบบ)
function logout() {
    localStorage.removeItem('it_session');
    window.location.replace('login.html');
}

// ฟังก์ชัน API Request หลัก
async function apiRequest(data, method = 'POST') {
    const response = await fetch(SCRIPT_URL, {
        method: method,
        body: JSON.stringify(data)
    });
    return await response.json();
}

function toggleLoader(show) {
    document.getElementById('loader').style.display = show ? 'flex' : 'none';
}
