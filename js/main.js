// เปลี่ยน URL นี้ให้เป็น Web App URL ที่ได้จากการ Deploy ใน Google Apps Script ของคุณ
const SCRIPT_URL = "https://script.google.com/macros/s/XXXXX/exec"; 

// 1. ฟังก์ชันช่วยเหลือแปลงไฟล์เป็น Base64
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

// 2. ฟังก์ชันควบคุมการแสดงผล Loader
function toggleLoader(show) {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = show ? 'flex' : 'none';
    }
}

// 3. ฟังก์ชัน API หลัก (จัดการ GET และ POST)
async function apiRequest(data = null, method = 'GET') {
    const options = {
        method: method,
        // สำคัญ: ต้องใช้โหมด 'no-cors' หรือจัดการฝั่ง Server ให้ดี
        // แต่โดยปกติ Apps Script POST มักส่งแบบ JSON String
        body: method === 'POST' ? JSON.stringify(data) : null
    };

    let url = SCRIPT_URL;
    if (method === 'GET' && data) {
        url += '?' + new URLSearchParams(data).toString();
    }

    try {
        const response = await fetch(url, options);
        // หมายเหตุ: หาก Apps Script ไม่ได้ตั้ง CORS อาจจะติดตรงนี้ 
        // แต่ในฟังก์ชัน output() ของคุณควรทำงานได้
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

// 4. ฟังก์ชันบันทึกงานใหม่ (สำหรับช่าง IT)
async function submitJob() {
    const btn = document.getElementById('btnSubmit');
    const docFile = document.getElementById('docFile').files[0];
    const repairPhoto = document.getElementById('repairPhoto').files[0];
    const jobType = document.getElementById('jobType').value;

    if (!jobType) {
        alert("กรุณาเลือกประเภทงาน");
        return;
    }

    // --- เริ่มกระบวนการ Feedback ---
    toggleLoader(true); // แสดง Spinner
    btn.disabled = true; // ป้องกันการกดซ้ำ
    btn.innerText = "กำลังอัปโหลดและบันทึก...";

    try {
        const payload = {
            action: 'createJob',
            jobType: jobType,
            assetID: document.getElementById('assetID').value,
            docNumber: document.getElementById('docNumber').value,
            assignBy: document.getElementById('assignBy').value,
            detail: document.getElementById('detail').value,
            status: 'รอรับงาน',
            // แปลงไฟล์เป็น Base64 ก่อนส่ง
            docFile: docFile ? await toBase64(docFile) : null,
            repairPhoto: repairPhoto ? await toBase64(repairPhoto) : null
        };

        const res = await apiRequest(payload, 'POST');

        if (res.success) {
            alert('บันทึกงานซ่อมและอัปโหลดไฟล์เรียบร้อยแล้ว! เลขที่ใบงาน: ' + res.jobId);
            location.reload(); // รีเฟรชหน้าเพื่อล้างฟอร์ม
        } else {
            alert('เกิดข้อผิดพลาดจากระบบ: ' + (res.error || 'ไม่ทราบสาเหตุ'));
        }
    } catch (e) {
        console.error(e);
        alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่');
    } finally {
        // --- สิ้นสุดกระบวนการ Feedback ---
        toggleLoader(false); // ซ่อน Spinner
        btn.disabled = false;
        btn.innerText = "บันทึกข้อมูลและเปิดใบงาน";
    }
}

// 5. โหลดข้อมูลเมื่อเข้าหน้าเว็บ
window.onload = async () => {
    // กฎความปลอดภัย: ตรวจสอบ Session จาก ITUser (คอลัมน์ที่ 5 ต้อง true)
    const user = JSON.parse(localStorage.getItem('session'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    // แสดงชื่อช่างที่ล็อกอิน
    document.getElementById('staffName').innerText = user.name;

    // แสดงสถานะกำลังโหลด Master Data
    toggleLoader(true);

    try {
        // ดึงข้อมูลครุภัณฑ์จาก BackupData
        const assets = await apiRequest({ action: 'getAssets' }, 'GET');
        const assetSelect = document.getElementById('assetID');
        if (assets && Array.isArray(assets)) {
            assets.forEach(a => {
                const opt = document.createElement('option');
                opt.value = a.assetID;
                opt.text = `${a.assetID} - ${a.name}`;
                assetSelect.appendChild(opt);
            });
        }
    } catch (e) {
        console.error("Master Data Load Error:", e);
    } finally {
        toggleLoader(false); // ปิด Spinner เมื่อโหลดข้อมูลเสร็จ
    }
};
