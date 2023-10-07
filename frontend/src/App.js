import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/Navbar';
import StudentCard from './components/Profile/student';
import CourseCard from './components/CourseCard';
import Information from './components/Cards/studentinfo';
import data from './components/Cards/data';
import Login from './Credentials/login';

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
            element={<><Login /></>}>
          </Route>
          <Route
          exact path='/home' 
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
          <Route
          exact path='/courses' 
          element={<><NavBar /></>}>
          </Route>
          <Route
          exact path='/attendance' 
          element={<><NavBar /></>}>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
