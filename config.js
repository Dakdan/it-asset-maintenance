// ===== API =====
const GAS_API =
  "https://script.google.com/macros/s/AKfycbwPg1Hwof0sUcM-gAvxBwE2PQ0HLdh_578aCHg_Cgq-JeQOcpQPm1zAE5C_uM7FqSg/exec";

// ===== SESSION =====
function setSession(user){
  localStorage.setItem("user", JSON.stringify(user));
}
function getSession(){
  return JSON.parse(localStorage.getItem("user") || "null");
}
function logout(){
  localStorage.clear();
  location.href = "index.html";
}
function requireLogin(){
  if(!getSession()) location.href="index.html";
}
