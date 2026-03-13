async function test() {
    const res = await fetch('http://localhost:2000/register',{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(
            {email:"jaipubg8496@gmail.com",password:"9353436378@"}
        )
    })
    const data = await res.json();
    console.log(data);
}
async function test1() {
    const res = await fetch('http://localhost:2000/login',{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(
            {email:"jaipubg8496@gmail.com",password:"9353436378@"}
        )
    })
    const data = await res.json();
    console.log(data);
}
async function test2() {
    const res = await fetch('http://localhost:2000/dashboard',{
        method:"GET",
        headers:{
            "Content-Type":"application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        
    })
    const data = await res.json();
    console.log(data);
}
test2();