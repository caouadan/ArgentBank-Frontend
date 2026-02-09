import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import SignIn from './pages/SignIn';

/* import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useSelector } from "react-redux" */

// Protéger la route de la page User en utilisant le composant ProtectedRoute
import ProtectedRoute from "./components/ProtectedRoute";
import User from './pages/User';

function App() {

/* On récupère l’état d’auth depuis Redux
    const isAuthenticated = useSelector(
    (state) => state.user.isAuthenticated
  ) */

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        {/* <Route path="/user" element={
            isAuthenticated ? <User /> : <Navigate to="/sign-in" />
          }
        /> */}
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
