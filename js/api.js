const API_URL = "https://script.google.com/macros/s/AKfycbzNSgpYNigJX7W-RUPq8SLN4e687pE55p72KsbM-nWFcPefKDhjzYAflsm78i42IW7qrw/exec";

async function apiGetJobs() {
  const res = await fetch(API_URL + "?action=list");
  return res.json();
}

async function apiUpdateStatus(jobId, status) {
  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "updateStatus",
      jobId: jobId,
      status: status
    })
  });
  return res.json();
}

