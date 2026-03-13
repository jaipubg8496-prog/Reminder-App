const API = "http://localhost:2000"; // change if needed

function showError(id,message){
document.getElementById(id).innerText = message;
}

function clearErrors(){
document.querySelectorAll(".error").forEach(e=>e.innerText="");
}

async function login(){

clearErrors();

const email = document.getElementById("loginEmail").value.trim();
const password = document.getElementById("loginPassword").value.trim();

let valid = true;

if(!email){
showError("loginEmailError","Email required");
valid=false;
}

if(!password){
showError("loginPasswordError","Password required");
valid=false;
}

if(!valid) return;

try{

const res = await fetch(`/login`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({email,password})
});

const data = await res.json();

if(!res.ok){
showError("loginPasswordError",data.error || data.message);
return;
}

localStorage.setItem("token",data.token);

window.location.href="/task.html";

}catch(err){
alert("Server error");
}

}

async function register(){

clearErrors();

const email = document.getElementById("regEmail").value.trim();
const password = document.getElementById("regPassword").value.trim();

let valid = true;

if(!email){
showError("regEmailError","Email required");
valid=false;
}

if(password.length < 6){
showError("regPasswordError","Min 6 characters");
valid=false;
}

if(!valid) return;

try{

const res = await fetch(`${API}/register`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({email,password})
});

const data = await res.json();

if(!res.ok){
showError("regEmailError",data.message);
return;
}

alert("Account created. Please login.");
window.location.href="login.html";

}catch(err){
alert("Server error");
}

}

document.getElementById("loginBtn")?.addEventListener("click",login);
document.getElementById("registerBtn")?.addEventListener("click",register);