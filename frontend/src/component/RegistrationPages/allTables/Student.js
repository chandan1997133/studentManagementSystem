import React, { useState } from 'react'
import Dashboard from '../Dashboard';
import './student.css'
import StudentPopup from '../StudentPopup';

const Student = (props) => {

  const [studentDetails, setStudentDetails] = useState([]);
  //deleting the student table entry on request
  const remove = (sid, aid) => (event) => {
    event.preventDefault();
    console.log("Student info deleted with id:", sid);
    let service = "STUDENT";
    const url = `http://localhost:3005/${props.name}/${service}/${sid}`
    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", url);
    xhr.send();
    // to delete the address field at the same time
    let service1 = "ADDRESS";
    const url1 = `http://localhost:3005/${props.name}/${service1}/${aid}`
    const xhr1 = new XMLHttpRequest();
    xhr1.open("DELETE", url1);
    xhr1.send();
  }

  // to fetch the data from the url below and display using show function
  function toDisplay(event) {
    event.preventDefault();
   
    const url = `http://localhost:3005/home/Students/${props.name}`;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = () => {
      setStudentDetails(JSON.parse(xhr.response));
    }
    xhr.send();
  }

  const [isOpen, setIsOpen] = useState(false);
  const [studId,setStudId] =useState(0);
  const togglePopup = (id) => (event)=> {
    event.preventDefault();
    setStudId(id);
    setIsOpen(!isOpen);
  }
  return (
    <div>
      <Dashboard />
      <div className='table-container'>
        <button onClick={toDisplay}>Load</button>
        <table className="table table-hover">
          <thead id="tableHead">
            <tr>
              <th>ID <i className="fa fa-caret-down _idSort" aria-hidden="true"></i>
              </th>
              <th>fname <i className="fa fa-caret-down nameSort" aria-hidden="true"></i>
              </th>
              <th>lname <i className="fa fa-caret-down nameSort" aria-hidden="true"></i>
              </th>
              <th>Gender <i className="fa fa-caret-down nameSort" aria-hidden="true"></i>
              </th>
              <th>Age <i className="fa fa-caret-down nameSort" aria-hidden="true"></i>
              </th>
              <th>Contact-no <i className="fa fa-caret-down nameSort" aria-hidden="true"></i>
              </th>
              <th>Address <i className="fa fa-caret-down nameSort" aria-hidden="true"></i>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="students-list">
            {
              studentDetails && studentDetails.map((index) => <><tr>
                <td>{index.student_id}</td>
                <td>{index.fname}</td>
                <td>{index.lname}</td>
                <td>{index.gender}</td>
                <td>{index.age}</td>
                <td>{index.contact_no}</td>
                <td>{index.address.street_address + "," + index.address.landmark + "," + index.address.city
                  + "," + index.address.state + "," + index.address.country + "-" + index.address.zipcode}</td>

                <td>
                  <button onClick={togglePopup(index.student_id)}>
                    <i className="material-icons" id="edit">edit</i>
                  </button>
                  {isOpen && <StudentPopup id={studId} handleChange={togglePopup} name={props.name}/> 
                   }
                  <button onClick={remove(index.student_id, index.address.id)}>
                    <i className="material-icons" id="delete">delete</i>
                  </button>
                </td>
              </tr>
              </>
              )
            }
          </tbody>
        </table>
      </div>
    </div>

  )
}

export default Student;
