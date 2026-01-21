const jobType=document.getElementById("jobType");
const jobSub=document.getElementById("jobSubType");
const table=document.querySelector("#jobTable tbody");

async function loadJobType(){
 jobType.innerHTML="<option>เลือกประเภทงาน</option>";
 let d=await apiGet("getJobTypes");
 d.forEach(x=>{
  jobType.innerHTML+=`<option value="${x.JobTypeID}">${x.JobTypeName}</option>`;
 });
}
async function loadSub(){
 jobSub.innerHTML="<option>เลือกงานย่อย</option>";
 let d=await apiGet("getJobSubTypes");
 d.filter(x=>x.JobTypeID==jobType.value)
 .forEach(x=>{
  jobSub.innerHTML+=`<option value="${x.SubTypeID}">${x.SubTypeName}</option>`;
 });
}

jobType.onchange=loadSub;

async function createJob(){
 let r=await apiPost({
  action:"createJob",
  jobType:jobType.value,
  jobSubType:jobSub.value,
  problem:problem.value,
  contact:contact.value,
  status:"รอรับงาน"
 });
 alert("สร้างงาน "+r.jobId);
 loadJobs();
}

async function loadJobs(){
 table.innerHTML="";
 let d=await apiGet("getJobs");
 d.forEach(j=>{
  let s=j.Status=="รอรับงาน"?"status-new":
        j.Status=="กำลังดำเนินการ"?"status-work":"status-done";
  table.innerHTML+=`
  <tr>
   <td>${j.JobID}</td>
   <td>${j.JobType}</td>
   <td class="${s}">${j.Status}</td>
   <td>
    ${j.Status=="รอรับงาน"?`<button onclick="acceptJob('${j.JobID}')">รับงาน</button>`:""}
    ${j.Status=="กำลังดำเนินการ"?`<button onclick="closeJob('${j.JobID}')">🔒 ปิดงาน</button>`:""}
   </td>
  </tr>`;
 });
}

function acceptJob(id){
 apiPost({action:"updateStatus",jobId:id,status:"กำลังดำเนินการ"})
 .then(loadJobs);
}
function closeJob(id){
 apiPost({action:"updateStatus",jobId:id,status:"ดำเนินการแล้วเสร็จ"})
 .then(loadJobs);
}

loadJobType();
loadJobs();
