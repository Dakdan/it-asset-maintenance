// ===============================
// CONFIG
// ===============================
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzNSgpYNigJX7W-RUPq8SLN4e687pE55p72KsbM-nWFcPefKDhjzYAflsm78i42IW7qrw/exec";

// ===============================
// CORE API
// ===============================
async function apiRequest(data) {
    const response = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return await response.json();
}

// ===============================
// UI HELPER
// ===============================
function toggleLoader(show) {
    const loader = document.getElementById("loader");
    if (!loader) return;
    loader.style.display = show ? "flex" : "none";
}

// ===============================
// REGISTER
// ===============================
async function handleRegister() {
    const data = {
        action: 'registerIT',
        USERID: document.getElementById('USERID').value,
        UserTypeID: "2",
        UserTypeName: document.getElementById('UserTypeName').value,
        UserName: document.getElementById('UserName').value,
        UserSname: document.getElementById('UserSname').value,
        UserNicName: document.getElementById('UserNicName').value || "",
        UserPN: document.getElementById('UserPN').value || "",
        UserMail: document.getElementById('UserMail').value,
        UserPic: ""
    };

    if (!data.USERID || !data.UserMail || !data.UserName) {
        return alert("กรุณากรอกข้อมูลสำคัญให้ครบ");
    }

    toggleLoader(true);

    try {
        const res = await apiRequest(data);
        if (res.success) {
            alert("ลงทะเบียนสำเร็จ และส่งรหัสไปที่ " + data.UserMail);
            window.location.href = "login.html";
        } else {
            alert(res.message || "ลงทะเบียนไม่สำเร็จ");
        }
    } catch (e) {
        alert("การเชื่อมต่อล้มเหลว");
    } finally {
        toggleLoader(false);
    }
}
