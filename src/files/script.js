const host = "http://localhost:2000/tasks";

const taskContainer = document.getElementById("tasks");
const t = localStorage.getItem('token');
if(!t){
    window.location.href='/login.html';
}

function showToast(message,type="success"){

const toast = document.createElement("div");
toast.className=`toast ${type}`;
toast.innerText=message;

const container = type==="success"
?document.getElementById("toast-right")
:document.getElementById("toast-center");

container.appendChild(toast);

setTimeout(()=>toast.remove(),3000);

}

async function retrieve(){

try{

const res = await fetch(host,{
    method:"GET",
    headers:{
        "Authorization": "Bearer " + localStorage.getItem("token")
    }
});


const data = await res.json();

if(!res.ok){
    taskContainer.innerHTML = `
            <p class="empty-text">✨ You have no tasks yet  
Start by creating your first task</p>
         `;
    throw new Error("Failed to fetch tasks");
} 


renderTasks(data);

}catch(err){

//showToast(err.message,"error");

}

}

function renderTasks(tasks){

taskContainer.innerHTML="";

tasks.forEach(task=>{

const div=document.createElement("div");
div.className="task";

div.innerHTML=`
<div class="task-info">
<h3>${task.title}</h3>
<p>${task.description}</p>
<p>Reminder: ${new Date(task.remind_at).toLocaleString()}</p>
</div>

<div class="task-actions">
<button class="edit">Edit</button>
<button class="delete">Delete</button>
</div>
`;

div.querySelector(".delete").onclick = () => removeTask(task.id);

div.querySelector(".edit").onclick = () => updateTask(task, div);

taskContainer.appendChild(div);

});

}
function formatDateTimeLocal(date){
  const d = new Date(date);

  return d.getFullYear() + "-" +
  String(d.getMonth()+1).padStart(2,"0") + "-" +
  String(d.getDate()).padStart(2,"0") + "T" +
  String(d.getHours()).padStart(2,"0") + ":" +
  String(d.getMinutes()).padStart(2,"0");
}

async function createTask(){

try{

const title=document.getElementById("title").value;
const description=document.getElementById("description").value;
const remind=document.getElementById("remind").value;

const title1=document.getElementById("title");
const description1=document.getElementById("description");
const remind1=document.getElementById("remind");

title1.addEventListener("input",()=>{
    title1.style.border = "2px solid black";
})
description1.addEventListener("input",()=>{
    description1.style.border = "2px solid black";
})
remind1.addEventListener("input",()=>{
    remind1.style.border = "2px solid black";
})
if(!title && !description && !remind) {
  title1.style.border = "2px solid red";
  description1.style.border = "2px solid red";
  remind1.style.border = "2px solid red";
  throw new Error("Feilds required");
}
else{
    if(!title) { title1.style.border = "2px solid red"; throw new Error("Title required")};
    if(!description ) { description1.style.border = "2px solid red"; throw new Error("description required")};
    if(!remind ) { remind1.style.border = "2px solid red"; throw new Error("reminder required")};
}


const res=await fetch('http://localhost:2000/tasks',{
method:"POST",
headers:{
"Content-Type":"application/json",
 "Authorization": "Bearer " + localStorage.getItem("token")
},
body:JSON.stringify({
title,
description,
remind_at:remind
})
});
const data = await res.json();
console.log(data);
if(data.error === "Token expired" || data.error ===  "Token required"){
    window.location.href='/login.html';
}
if(!res.ok) throw new Error("Failed to create task");


showToast("Task created");
document.getElementById("title").innerText="ok";

retrieve();

}catch(err){



}

}
function updateTask(task, container){

container.innerHTML = `
<div class="task-edit">

<input 
type="text" 
id="edit-title" 
value="${task.title}"
/>

<textarea id="edit-desc">${task.description}</textarea>

<input 
type="datetime-local" 
id="edit-remind"
value="${formatDateTimeLocal(task.remind_at)}"
/>

<div class="task-actions">
<button class="save">Save</button>
<button class="cancel">Cancel</button>
</div>

</div>
`;

container.querySelector(".save").onclick = async () => {

const title = document.getElementById("edit-title").value.trim();
const description = document.getElementById("edit-desc").value.trim();
const remind_at = document.getElementById("edit-remind").value;

if(
title === task.title &&
description === task.description &&
remind_at === formatDateTimeLocal(task.remind_at)
){
showToast("No changes made");
retrieve();
return;
}

try{

const res = await fetch(`${host}/${task.id}`,{
method:"PUT",
headers:{
"Content-Type":"application/json",
"Authorization": "Bearer " + localStorage.getItem("token")
},
body:JSON.stringify({
title,
description,
remind_at
})
});

if(!res.ok) throw new Error("Update failed");

showToast("Task updated");

retrieve();

}catch(err){

showToast(err.message,"error");

}

};

container.querySelector(".cancel").onclick = () => retrieve();

}


async function removeTask(id){

try{

const res=await fetch(`${host}/${id}`,{
method:"DELETE",
headers:{
    "Authorization": "Bearer " + localStorage.getItem("token")
}
});

if(!res.ok) throw new Error("Delete failed");

showToast("Task deleted");

retrieve();

}catch(err){

showToast(err.message,"error");

}

}
function showPopup(task) {

    document.getElementById("popupTitle").innerText = task.title;
    document.getElementById("popupDesc").innerText = task.description;

    document.getElementById("reminderPopup").style.display = "flex";

    document.getElementById("acceptBtn").onclick = () => moveToProgress(task,"accept");
    document.getElementById("rejectBtn").onclick = () => moveToProgress(task,"reject");

}

function closePopup() {
    document.getElementById("reminderPopup").style.display = "none";
}
async function moveToProgress(task,status) {
    console.log(task);
    await fetch("/progress", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
             "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({
            task_id:task.task_id,
            title: task.title,
            description:task.description,
            status
        })
    });
    
    closePopup();
    retrieve();
}
let shownReminders = new Set();

async function checkReminders(){

   const res = await fetch("/remind");
   const tasks = await res.json();

   const now = new Date();

   tasks.forEach(task => {

      const remindTime = new Date(task.remind_datetime);
    
      if(
         now >= remindTime &&
         now - remindTime <= 3600000 &&
         !shownReminders.has(task.id)
      ){
         showPopup(task);
         shownReminders.add(task.id);
      }

   });

}
// check every 30 seconds

document.getElementById("createBtn").addEventListener("click",createTask);
retrieve().then(()=>{
   checkReminders();
   setInterval(checkReminders,30000);
});
retrieve();