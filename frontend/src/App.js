import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/Navbar';
import StudentCard from './components/Profile/student';
import CourseCard from './components/CourseCard';
import Information from './components/Cards/studentinfo';
import data from './components/Cards/data';

function App() {

  const cards = data.map(item => {
    return (
      <Information
        key={item.id}
        {...item}

        />
    )
  })
  
  return (
    <Router>
      <div>
        <Routes>
          <Route
          exact path='/' 
          element={<><NavBar /><CourseCard /></>}>
          </Route>
          <Route
          exact path='/profile' 
          element={<><NavBar /><StudentCard /></>}>
          </Route>
          <Route
          exact path='/student_info' 
          element={<><NavBar />{cards}</>}>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
