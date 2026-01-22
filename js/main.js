const SCRIPT_URL = "YOUR_DEPLOYED_WEB_APP_URL";

// 1. ฟังก์ชันช่วยเหลือแปลงไฟล์
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

// 2. ฟังก์ชัน API หลัก
async function apiRequest(data = null, method = 'GET') {
    const options = {
        method: method,
        body: method === 'POST' ? JSON.stringify(data) : null
    };
    let url = SCRIPT_URL;
    if (method === 'GET' && data) {
        url += '?' + new URLSearchParams(data).toString();
    }
    const response = await fetch(url, options);
    return await response.json();
}

// 3. ฟังก์ชันบันทึกงานใหม่ (สำหรับช่าง IT)
async function submitJob() {
    const btn = document.getElementById('btnSubmit');
    btn.disabled = true;
    btn.innerText = "กำลังบันทึก...";

    const docFile = document.getElementById('docFile').files[0];
    const repairPhoto = document.getElementById('repairPhoto').files[0];

    const payload = {
        action: 'createJob',
        jobType: document.getElementById('jobType').value,
        assetID: document.getElementById('assetID').value,
        docNumber: document.getElementById('docNumber').value,
        assignBy: document.getElementById('assignBy').value,
        status: 'รอรับงาน',
        docFile: docFile ? await toBase64(docFile) : null,
        repairPhoto: repairPhoto ? await toBase64(repairPhoto) : null
    };

    try {
        const res = await apiRequest(payload, 'POST');
        if (res.success) {
            alert('บันทึกงานซ่อมเรียบร้อยแล้ว!');
            location.reload();
        }
    } catch (e) {
        alert('เกิดข้อผิดพลาดในการบันทึก');
    } finally {
        btn.disabled = false;
        btn.innerText = "บันทึกข้อมูล";
    }
}

// 4. โหลดข้อมูลเมื่องานเริ่ม
window.onload = async () => {
    // เช็ค Login (กฎ ITUser)
    const user = JSON.parse(localStorage.getItem('session'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    document.getElementById('staffName').innerText = user.name;
    
    // โหลด Master Data
    const assets = await apiRequest({action: 'getAssets'}, 'GET');
    const assetSelect = document.getElementById('assetID');
    assets.forEach(a => {
        assetSelect.innerHTML += `<option value="${a.assetID}">${a.assetID} - ${a.name}</option>`;
    });
};
