const API="/dashboard";

let pieChart;
let barChart;

async function loadDashboard(){

const res=await fetch(API,{
headers:{
Authorization:"Bearer "+localStorage.getItem("token")
}
});

const data=await res.json();

let accept=0;
let reject=0;

const acceptBox=document.getElementById("acceptTasks");
const rejectBox=document.getElementById("rejectTasks");

acceptBox.innerHTML="";
rejectBox.innerHTML="";

data.forEach(task=>{

const html=`
<div class="task">
<strong>${task.title}</strong>
<div>${task.description}</div>
</div>
`;

if(task.status==="accept"){
accept++;
acceptBox.innerHTML+=html;
}else{
reject++;
rejectBox.innerHTML+=html;
}

});

const total=accept+reject;

document.getElementById("totalTasks").innerText=total;
document.getElementById("acceptCount").innerText=accept;
document.getElementById("rejectCount").innerText=reject;

createPie(accept,reject);
createBar(accept,reject);
}

function createPie(a,r){

const ctx=document.getElementById("pieChart");

if(pieChart) pieChart.destroy();

pieChart=new Chart(ctx,{
type:"doughnut",
data:{
labels:["Accept","Reject"],
datasets:[{
data:[a,r],
backgroundColor:["#22C55E","#EF4444"]
}]
}
});
}

function createBar(a,r){

const ctx=document.getElementById("barChart");

if(barChart) barChart.destroy();

barChart=new Chart(ctx,{
type:"bar",
data:{
labels:["Accept","Reject"],
datasets:[{
data:[a,r],
backgroundColor:["#22C55E","#EF4444"]
}]
},
options:{
plugins:{legend:{display:false}},
scales:{
y:{beginAtZero:true}
}
}
});
}

loadDashboard();