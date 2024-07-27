import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Header from './component/Header/Header';
import SignUp from './pages/SignUp/SignUp';
import './App.css';
const App = () => {
  return (
    <>
    <Header/>
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
    </>
  );
};

export default App;
