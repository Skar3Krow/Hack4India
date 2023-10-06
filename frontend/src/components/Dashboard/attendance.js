import React from 'react';

const AttendanceCard = ({ totalClassesAttended, totalClassesMissed, attendancePercentage }) => (
  <div className="attendance-card">
    <h2>Attendance Summary</h2>
    <p>Total Classes Attended: {totalClassesAttended}</p>
    <p>Total Classes Missed: {totalClassesMissed}</p>
    <p>Attendance Percentage: {attendancePercentage}%</p>
  </div>
);

export default AttendanceCard;
