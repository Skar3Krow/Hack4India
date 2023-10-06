import React from "react";
import '../../assets/studentinfo.css';
    
function Information(props) {
    return (
        <>
        <h1>Student Information</h1>
        <div>
            <p>First Name : {props.firstName}</p>
            <p>Last Name : {props.lastName}</p>
            <p>Date of Birth : {props.DOB}</p>
            <p>Address : {props.address}</p>
            <p>Branch : {props.branch}</p>
            <p>Mobile No. : {props.contactNo1}</p>
            <p>Telephone No. : {props.contactNo2}</p>
        </div>
        </>
);
}
export default Information;