const table=document.querySelector("#jobTable tbody");

async function loadJobs(){
 table.innerHTML="";
 let d=await apiGet("getJobs");
 d.filter(j=>j.Status!="ดำเนินการแล้วเสร็จ")
  .forEach(j=>{
   table.innerHTML+=`
   <tr>
    <td>${j.JobID}</td>
    <td>${j.JobType}</td>
    <td>${j.Status}</td>
    <td>
     ${j.Status=="รอรับงาน"
      ?`<button onclick="update('${j.JobID}','กำลังดำเนินการ')">รับงาน</button>`:""}
     ${j.Status=="กำลังดำเนินการ"
      ?`<button onclick="update('${j.JobID}','ดำเนินการแล้วเสร็จ')">ปิดงาน</button>`:""}
    </td>
   </tr>`;
  });
}

function update(id,status){
 apiPost({action:"updateStatus",jobId:id,status})
 .then(loadJobs);
}

loadJobs();
