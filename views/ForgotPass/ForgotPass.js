async function forgotPassword(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const userData = {
        email
    }

    try {
        const token = localStorage.getItem('token')
        const data = await axios.post('http://localhost:3000/password/forgotpassword',userData, { headers: { 'Authorization': token }});
        if(data.data.success === true) {
            const message = document.getElementById('error');
            message.innerHTML = ''
            message.innerHTML+= 'Email Sent Successfully'

        }
    } catch (err) {
        console.log(err)
    }

}