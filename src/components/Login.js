import React from 'react'

function Login() {



    return (
        <>
            <h2>Log In</h2>
            <form action="submit">
                <div>
                    <label htmlFor="userName" hidden>Provide your</label>
                    <input type="text"  placeholder="User Name" id="userName"/>
                </div>
                <div>
                    <label htmlFor="emailAddress" hidden>Email Address</label>
                    <input type="text"  placeholder="Email Address" id="emailAddress"/>
                </div>
                <button>Log In</button>
            </form>
        </>
    )
}

export default Login;
