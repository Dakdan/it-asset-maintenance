const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzNSgpYNigJX7W-RUPq8SLN4e687pE55p72KsbM-nWFcPefKDhjzYAflsm78i42IW7qrw/exec";

async function apiRequest(data){
  const res = await fetch(SCRIPT_URL,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}
