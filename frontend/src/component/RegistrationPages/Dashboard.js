import React from 'react'
import './style.css'
import { Link } from "react-router-dom";
import {useNavigate } from 'react-router'

const Dashboard = () => {
    let navigate =useNavigate();

    function handleSignOut(){
        sessionStorage.clear();
        navigate("/");
    }
    return (
        <>
            <div className='header'>
                Student-Course Registration
                <button id="signout" onClick={handleSignOut}>SignOut</button>    
            </div>
            <div className='left-navibar'>
                <ul>
                    <li><Link className="nav-item" to="/dashboard/student">Student</Link></li>
                    <li><Link className="nav-item" to="/dashboard/add-student">Add Student</Link></li>
                    <li><Link className="nav-item" to="/dashboard/course">Courses</Link></li>
                    <li><Link className="nav-item" to="/dashboard/add-course">Add Course</Link></li>
                    <li><Link className="nav-item" to="/dashboard/report">Report</Link></li>
                </ul>
            </div>
                             
       </>          
    )
}

export default Dashboard;
