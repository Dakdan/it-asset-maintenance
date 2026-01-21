const jobList = document.getElementById("jobList");

// LOGIN ครั้งแรก
let IT_USER = localStorage.getItem("IT_USER");
if (!IT_USER) {
  IT_USER = prompt("กรุณาใส่ชื่อเจ้าหน้าที่ IT");
  localStorage.setItem("IT_USER", IT_USER);
}

loadJobs();

async function loadJobs() {
  try {
    const jobs = await apiGetJobs();
    renderJobs(jobs);
  } catch (err) {
    jobList.innerHTML = "❌ โหลดข้อมูลไม่สำเร็จ";
  }
}

function renderJobs(jobs) {
  if (!jobs.length) {
    jobList.innerHTML = "ไม่มีงานแจ้งซ่อม";
    return;
  }

  jobList.innerHTML = "";
  jobs.forEach(j => {
    const div = document.createElement("div");
    div.className = "job";

    div.innerHTML = `
      <b>${j.JobID}</b><br>
      อุปกรณ์: ${j.AssetName || "-"}<br>
      สถานะ: <span class="status">${j.Status || "NEW"}</span><br><br>
      <button class="btn-start" onclick="updateJob('${j.JobID}','START')">รับงาน</button>
      <button class="btn-close" onclick="updateJob('${j.JobID}','CLOSE')">ปิดงาน</button>
    `;

    jobList.appendChild(div);
  });
}

async function updateJob(jobId, action) {
  await apiUpdateJob(jobId, action, IT_USER);
  loadJobs();
}
