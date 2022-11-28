import React, { useState } from 'react'
import './popup.css'
import '../RegistrationPages/allTables/student.css'



const StudentPopup = (props) => {
     //for storing edit form details.   
    const [inputField, setInputField] = useState({})

    const inputsHandler = (e) => {
        e.preventDefault();
        setInputField((inputField)=>
            ({ 
                ...inputField,
                [e.target.name]: e.target.value,
             }));
    }
    //function edit to be performed on table data
    async function edit(event) {
        event.preventDefault();
    let addressData1 = {
        "street_address": inputField.street,
        "landmark": inputField.landmark,
        "city": inputField.city,
        "state": inputField.state,
        "country": inputField.country,
        "zipcode": parseInt(inputField.zipcode),
    }
    //create student object with all data
    let studData1 = {
        "fname": inputField.fname,
        "lname": inputField.lname,
        "gender": inputField.gender,
        "age": parseInt(inputField.age),
        "contact_no": parseFloat(inputField.contact),
        "address": addressData1
    }
    let service = "STUDENT";
    await fetch(`http://localhost:3005/${props.name}/update/${service}/${props.id}`, {  // Enter your IP address here

        method: 'PATCH',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(studData1) // body data type must match "Content-Type" header
    });
}

return (
    <div className="popup-box">
        <div className="box">
            <button className="close-icon" >x</button>
            <form encType="multipart/form-data">
                <div className="form" >
                    <span className="title">Student Details</span>
                    <div className="fields">
                        <div className="input-field">
                            <label>First Name</label>
                            <input type="text"  name="fname" onChange={inputsHandler} placeholder="Enter your first name" required />
                        </div>

                        <div className="input-field">
                            <label>Last Name</label>
                            <input type="text" name="lname" onChange={inputsHandler} placeholder="Enter your last name" required />
                        </div>

                        <div className="input-field">
                            <label>Gender</label>
                            <select name="gender" onChange={inputsHandler} required>
                                <option disabled selected>Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>

                        <div className="input-field">
                            <label>Age</label>
                            <input type="text" name="age" onChange={inputsHandler} placeholder="Enter your age" required />
                        </div>

                        <div className="input-field">
                            <label>Mobile Number</label>
                            <input type="number" name="contact" onChange={inputsHandler} placeholder="Enter mobile number" required />
                        </div>
                    </div>
                    <hr />
                    <div className="details">
                        <span className="title">Address Details</span>
                        <div className="fields">
                            <div className="input-field">
                                <label>Street-Address</label>
                                <input type="text" name="street" onChange={inputsHandler} placeholder="Enter your Street-Address" required />
                            </div>

                            <div className="input-field">
                                <label>Landmark</label>
                                <input type="text" name="landmark" onChange={inputsHandler} placeholder="Enter Landmark" required />
                            </div>

                            <div className="input-field">
                                <label>City</label>
                                <input type="text" name="city" onChange={inputsHandler} placeholder="Enter city" required />
                            </div>

                            <div className="input-field">
                                <label> State</label>
                                <input type="text" name="state" onChange={inputsHandler} placeholder="Enter state" required />
                            </div>

                            <div className="input-field">
                                <label>Country</label>
                                <input type="text" name="country" onChange={inputsHandler} placeholder="Enter country" required />
                            </div>

                            <div className="input-field">
                                <label>Zipcode</label>
                                <input type="number" name="zipcode" onChange={inputsHandler} placeholder="Enter area zipcode" required />
                            </div>
                        </div>

                        <button className="submitBtn" onClick={edit}>
                            <span className="btnText" >Submit</span>

                        </button>
                    </div>
                    {props.id}
                </div>
            </form>
        </div>
    </div>
)
}

export default StudentPopup
