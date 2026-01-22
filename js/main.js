// 1. ตั้งค่า URL (กรุณาใส่ URL ของคุณที่นี่)
const SCRIPT_URL = "1TUcThdPyAqFRwkFg1NTMtwqbFVjrkJXWqYw0AlwwriI"; 

// 2. ระบบควบคุม Feedback Loader (ทำงานเมื่อถูกสั่งเท่านั้น)
function toggleLoader(show) {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = show ? 'flex' : 'none';
    }
}

// 3. ฟังก์ชันแปลงไฟล์เป็น Base64
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

// 4. API Request หลัก (ปรับปรุงให้รองรับ Apps Script)
async function apiRequest(data = null, method = 'GET') {
    let url = SCRIPT_URL;
    const options = {
        method: method,
        mode: 'cors' 
    };

    if (method === 'GET' && data) {
        url += '?' + new URLSearchParams(data).toString();
    } else if (method === 'POST') {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

// 5. ฟังก์ชันสำหรับบันทึกงานใหม่ (สำหรับหน้า index.html)
async function submitJob() {
    const btn = document.getElementById('btnSubmit');
    const docFile = document.getElementById('docFile').files[0];
    const repairPhoto = document.getElementById('repairPhoto').files[0];
    const jobType = document.getElementById('jobType').value;

    if (!jobType) return alert("กรุณาเลือกประเภทงาน");

    toggleLoader(true);
    btn.disabled = true;

    try {
        const payload = {
            action: 'createJob',
            jobType: jobType,
            assetID: document.getElementById('assetID').value,
            docNumber: document.getElementById('docNumber').value,
            assignBy: document.getElementById('assignBy').value,
            detail: document.getElementById('detail').value,
            status: 'รอรับงาน',
            docFile: docFile ? await toBase64(docFile) : null,
            repairPhoto: repairPhoto ? await toBase64(repairPhoto) : null
        };

        const res = await apiRequest(payload, 'POST');
        if (res.success) {
            alert('บันทึกสำเร็จ!');
            location.reload();
        }
    } catch (e) {
        alert('เกิดข้อผิดพลาดในการบันทึก');
    } finally {
        toggleLoader(false);
        btn.disabled = false;
    }
}

// 6. ฟังก์ชันสำหรับ Login (สำหรับหน้า login.html)
async function handleLogin() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;

    if(!u || !p) return alert("กรุณากรอกข้อมูลให้ครบ");

    toggleLoader(true);
    try {
        const res = await apiRequest({ action: 'loginIT', email: u, password: p }, 'POST');
        if (res.success) {
            localStorage.setItem('session', JSON.stringify(res));
            window.location.replace('index.html'); // ใช้ replace เพื่อป้องกัน loop
        } else {
            alert("ข้อมูลไม่ถูกต้อง หรือไม่ได้รับสิทธิ์ (Status != true)");
        }
    } catch (e) {
        alert("เชื่อมต่อไม่สำเร็จ");
    } finally {
        toggleLoader(false);
    }
}
