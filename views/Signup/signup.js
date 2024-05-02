

async function userSignup(event) {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    const userData = {
        username,
        email,
        password
    };
    // console.log(userData);
    
    try {
        const data = await axios.post('http://localhost:3000/user/signup',userData);
        // console.log(data.data);
        console.log('before the alert')
        // alert(`Welcome ${username}!, Please Login`);
        window.location.href = '../Login/login.html'
        console.log('past the alert')


    } catch(err) {
        // console.log(err.message);
        console.log(err.response.data)
        const parent = document.getElementById('error');
        parent.innerHTML = parent.innerHTML + err.response.data.err;

    }

}


