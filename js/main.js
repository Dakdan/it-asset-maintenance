// 1. ตั้งค่า URL (ต้องได้จากการ Deploy แบบ Anyone)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzNSgpYNigJX7W-RUPq8SLN4e687pE55p72KsbM-nWFcPefKDhjzYAflsm78i42IW7qrw/exec";

async function apiRequest(data) {
    const response = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(data)
    });
    return await response.json();
}

// ฟังก์ชันดึงค่าจากหน้า Register ส่งไปให้ Script
async function handleRegister() {
    const data = {
        action: 'registerIT',
        USERID: document.getElementById('USERID').value,
        UserTypeID: "2", // กำหนดค่ามาตรฐานตามระบบคุณ
        UserTypeName: document.getElementById('UserTypeName').value,
        UserName: document.getElementById('UserName').value,
        UserSname: document.getElementById('UserSname').value,
        UserNicName: document.getElementById('UserNicName').value || "",
        UserPN: document.getElementById('UserPN').value || "",
        UserMail: document.getElementById('UserMail').value,
        UserPic: "" // ว่างไว้ก่อนตามโครงสร้าง
    };

    // ตรวจสอบค่าว่างเบื้องต้น
    if(!data.USERID || !data.UserMail || !data.UserName) {
        return alert("กรุณากรอกข้อมูลสำคัญให้ครบ");
    }

    try {
        const res = await apiRequest(data);
        if (res.success) {
            alert("ลงทะเบียนสำเร็จและส่งรหัสไปที่ " + data.UserMail);
            window.location.href = "login.html";
        }
    } catch (e) {
        alert("การเชื่อมต่อล้มเหลว");
    }
}
