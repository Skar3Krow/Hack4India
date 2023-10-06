import React from 'react';

const StudentCard = ({ name, studentId, contactDetails, profilePicture, major, year }) => (
  <div className="student-card">
    <h2>Student Information</h2>
    <div className="profile">
      <div className="profile-image">
        <img src={profilePicture} alt={name} />
      </div>
      <div className="profile-details">
        <p>Name: {name}</p>
        <p>Student ID: {studentId}</p>
        <p>Contact Details: {contactDetails}</p>
        <p>Major: {major}</p>
        <p>Year: {year}</p>
      </div>
    </div>
  </div>
);

export default StudentCard;