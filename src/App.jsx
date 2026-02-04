import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import ProtectedRoute from "./components/ProtectedRoute";
import User from './pages/User';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/user" element={
            <ProtectedRoute>
              <User />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
