// ---------- UI ----------
function toggleLoader(show){
  const el = document.getElementById("loader");
  if(el) el.style.display = show ? "flex" : "none";
}

function showPopup(msg, title="แจ้งเตือน"){
  document.getElementById("popup-title").innerText = title;
  document.getElementById("popup-message").innerText = msg;
  document.getElementById("popup").style.display = "flex";
}
function closePopup(){
  document.getElementById("popup").style.display = "none";
}

// ---------- LOGIN ----------
async function handleLogin(){
  const USERID = document.getElementById("username").value.trim();
  const UserPW = document.getElementById("password").value.trim();

  if(!USERID || !UserPW){
    showPopup("กรุณากรอก Username และ Password");
    return;
  }

  toggleLoader(true);
  try{
    const res = await apiRequest({
      action:"login",
      username: USERID,
      password: UserPW
    });

    if(res.success){
      localStorage.setItem("it_session", JSON.stringify(res.data));
      location.href="index.html";
    }else{
      showPopup(res.message);
    }
  }catch{
    showPopup("เชื่อมต่อระบบไม่ได้");
  }finally{
    toggleLoader(false);
  }
}

// ---------- REGISTER ----------
async function handleRegister(){
  const data = {
    action:"registerIT",
    USERID: document.getElementById("reg_user").value.trim(),
    UserTypeName: "IT",
    UserName: document.getElementById("reg_name").value.trim(),
    UserSname: document.getElementById("reg_sname").value.trim(),
    UserMail: document.getElementById("reg_email").value.trim()
  };

  if(!data.USERID || !data.UserName || !data.UserMail){
    showPopup("กรุณากรอกข้อมูลให้ครบ");
    return;
  }

  toggleLoader(true);
  try{
    const res = await apiRequest(data);
    if(res.success){
      showPopup("สมัครสมาชิกสำเร็จ","สำเร็จ");
      setTimeout(()=>location.href="login.html",1200);
    }else{
      showPopup(res.message);
    }
  }catch{
    showPopup("เชื่อมต่อระบบไม่ได้");
  }finally{
    toggleLoader(false);
  }
}

// ---------- SESSION ----------
function checkSession(){
  if(!localStorage.getItem("it_session")){
    location.href="login.html";
  }
}
function logout(){
  localStorage.removeItem("it_session");
  location.href="login.html";
}
