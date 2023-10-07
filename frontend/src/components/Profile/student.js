import React from 'react';
import '../../assets/student.css'
import cooldudes from '../../assets/cooldudes.png'
import att from '../../assets/att.png'
import courses2 from '../../assets/courses2.png'
import si from '../../assets/si.jpg'
import { Link } from 'react-router-dom';
const StudentCard = ({ name, studentId, contactDetails, profilePicture, major, year }) => (
  <div className="student-card">
    <div className='headbox'>
      <div className='d1'>
        <div className='d2'>
        <p>Welcome Back, John !</p>
          <p id='small'>Always stay updated in your study portal</p> {/*props*/}
      </div>
      
      <div className='d3'>
        <img src={cooldudes} alt='lorem ipsum' />
      </div>
      </div>
    </div>
  <div className='cardbox'>
    <div className='threecards'>
    <img src={si}/>
    <h1 className='ff'><Link to='/student_info'>Student Information</Link></h1>
    </div>
    <div className='threecards'>
      <img src={courses2}/>
      <h1 className='ff'><Link to='/courses'>Enrolled Courses</Link></h1>
    </div>
    <div className='threecards'>
      <img src={att} />
      <h1 className='ff'><Link to='/attendance'>Attendance Summary</Link></h1>
    </div>
  </div>  
  </div>
);

export default StudentCard;