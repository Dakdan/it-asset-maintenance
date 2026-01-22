// 1. ตั้งค่า URL (กรุณาใส่ URL ของคุณที่นี่)
const SCRIPT_URL = "YOUR_APPS_SCRIPT_URL_HERE"; 

// 2. ระบบควบคุม Feedback Loader (แก้ไขให้เสถียรขึ้น)
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

// 4. API Request หลัก
async function apiRequest(data = null, method = 'GET') {
    let url = SCRIPT_URL;
    const options = {
        method: method,
        // ใช้โหมดที่รองรับ Apps Script ได้ดีที่สุด
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

// 5. ฟังก์ชันบันทึกงานใหม่ (สำหรับช่าง IT)
async function submitJob() {
    const btn = document.getElementById('btnSubmit');
    const docFile = document.getElementById('docFile').files[0];
    const repairPhoto = document.getElementById('repairPhoto').files[0];
    const jobType = document.getElementById('jobType').value;

    if (!jobType) {
        alert("กรุณาเลือกประเภทงาน");
        return;
    }

    // เริ่มแสดงผลสถานะการทำงาน
    toggleLoader(true);
    btn.disabled = true;
    btn.innerText = "กำลังบันทึกข้อมูล...";

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
        } else {
            alert('เกิดข้อผิดพลาด: ' + (res.error || 'ข้อมูลไม่ถูกต้อง'));
        }
    } catch (e) {
        alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
        toggleLoader(false);
        btn.disabled = false;
        btn.innerText = "บันทึกข้อมูล";
    }
}

// 6. ควบคุมการโหลดหน้าเว็บ (แก้ไขจุดบกพร่องที่ทำให้จอกระพริบ)
window.onload = async () => {
    const session = JSON.parse(localStorage.getItem('session'));
    const isLoginPage = window.location.pathname.includes('login.html');

    // ถ้าไม่มี Session และไม่ได้อยู่ที่หน้า Login ให้ไปหน้า Login
    if (!session && !isLoginPage) {
        window.location.replace('login.html');
        return;
    }

    // ถ้ามี Session แล้วพยายามเข้าหน้า Login ให้ส่งไปหน้าหลัก
    if (session && isLoginPage) {
        window.location.replace('index.html');
        return;
    }

    // ส่วนการทำงานเฉพาะหน้า Dashboard (index.html)
    const staffNameElem = document.getElementById('staffName');
    if (staffNameElem && session) {
        staffNameElem.innerText = session.name;
        
        // โหลดข้อมูล Master Data (ทำเพียงครั้งเดียว)
        toggleLoader(true);
        try {
            const assets = await apiRequest({action: 'getAssets'}, 'GET');
            const select = document.getElementById('assetID');
            if (select && assets) {
                assets.forEach(a => {
                    const opt = document.createElement('option');
                    opt.value = a.assetID;
                    opt.text = `${a.assetID} - ${a.name}`;
                    select.appendChild(opt);
                });
            }
        } catch (e) {
            console.error("Load Assets Failed");
        } finally {
            toggleLoader(false); // ปิด Loader เมื่อทุกอย่างเสร็จ
        }
    }
};
