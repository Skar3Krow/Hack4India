import React from 'react';

const CourseCard = ({ course, onClick }) => (
  <div className="course-card">
    <h2>Class Schedule</h2>
    <ul>
      {Array.isArray(course) && course.length > 0 ? (
        course.map((course) => (
          <li key={course.id}>
          </li>
        ))
      ) : (
        <p>No courses available.</p>
      )}
    </ul>
  </div>
);

export default CourseCard;