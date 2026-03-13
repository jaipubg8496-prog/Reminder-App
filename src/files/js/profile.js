const API = "http://localhost:2000"; // change if needed

const emailText = document.getElementById("userEmail");
const avatarLetter = document.getElementById("avatarLetter");
const logoutBtn = document.getElementById("logoutBtn");

async function loadProfile(){
    try{

        const token = localStorage.getItem("token");

        if(!token){
            window.location.href = "login.html";
            return;
        }

        const res = await fetch(`${API}/profile`,{
            headers:{
                "Authorization":`Bearer ${token}`
            }
        });

        if(!res.ok){
            throw new Error("Unauthorized");
        }

        const data = await res.json();

        const email = data.email;

        emailText.innerText = email;
        avatarLetter.innerText = email.charAt(0).toUpperCase();

    }
    catch(err){
        console.log(err);
        window.location.href = "login.html";
    }
}

logoutBtn.addEventListener("click",()=>{
    localStorage.removeItem("token");
    window.location.href = "login.html";
});

loadProfile();

// ================= REMOVE ACCOUNT =================

const deleteBtn = document.getElementById("deleteAccountBtn");

deleteBtn.addEventListener("click", async () => {

    // confirm before deleting (good UX practice)
    const confirmDelete = confirm("Are you sure you want to delete your account? This action cannot be undone.");

    if(!confirmDelete) return;

    try{

        const token = localStorage.getItem("token");

        // fetch DELETE request to backend
        const res = await fetch(`/delete-account`,{
            method:"DELETE",
            headers:{
                "Authorization":`Bearer ${token}`,
                "Content-Type":"application/json"
            }
        });

        const data = await res.json();

        if(!res.ok){
            alert(data.message || "Failed to delete account");
            return;
        }

        // remove token after successful delete
        localStorage.removeItem("token");

        alert(data.message);

        
        window.location.href = "login.html";
    

    }
    catch(err){
        console.log(err);
        alert("Server error");
    }

});