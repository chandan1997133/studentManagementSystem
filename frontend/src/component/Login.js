import React, { useEffect } from 'react'
import './login.css';
import jwt_decode from 'jwt-decode';
import {useNavigate } from 'react-router'

const Login = () => {
       let navigate =useNavigate();

    function handleCallbackResponse(response) {
        console.log(response)
        // jwt help to convert the access token to meaning full information
        var userObject = jwt_decode(response.credential);
        sessionStorage.setItem("token", JSON.stringify(userObject));
        navigate("/dashboard");
    }

   // google account login 
    useEffect(() => {
        /*global google*/
        google.accounts.id.initialize({
            client_id: "1034160483436-sg1lshum10fbiifq6jbf88d2m394h118.apps.googleusercontent.com",
            callback: handleCallbackResponse
        });

        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            {  size: "large", align: "center" }
        )
    });
    
   

    return (
       <div className="box-form">
           <div className="left">
               <div className="overlay">
                   <h1>Student Management</h1>
                   <p>Details of students with list of courses</p>
                       <div id="signInDiv"></div>
                       
               </div>
           </div>
        </div>
    )
}
export default Login;


