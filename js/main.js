document.addEventListener("DOMContentLoaded", loadJobs);

async function loadJobs() {
  const box = document.getElementById("jobList");
  box.innerHTML = "⏳ กำลังโหลดข้อมูล...";

  try {
    const data = await apiGetJobs();

    if (!data.length) {
      box.innerHTML = "ไม่มีงาน";
      return;
    }

    box.innerHTML = "";
    data.forEach(job => {
      const div = document.createElement("div");
      div.className = "job";
      div.innerHTML = `
        <b>${job.JobID}</b><br>
        ประเภท: ${job.JobType || "-"}<br>
        สถานะ: ${job.Status || "ใหม่"}<br><br>
        <button onclick="takeJob('${job.JobID}')">รับงาน</button>
        <button class="close" onclick="closeJob('${job.JobID}')">ปิดงาน</button>
      `;
      box.appendChild(div);
    });
  } catch (e) {
    box.innerHTML = "❌ โหลดข้อมูลไม่สำเร็จ";
  }
}

async function takeJob(jobId) {
  await apiUpdateStatus(jobId, "In Progress");
  loadJobs();
}

async function closeJob(jobId) {
  await apiUpdateStatus(jobId, "Closed");
  loadJobs();
}
