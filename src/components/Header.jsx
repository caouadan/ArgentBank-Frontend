import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout, fetchUserProfile } from "../store/userSlice"
import { useEffect } from "react"
import logo from "../assets/img/argentBankLogo.png"

function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user, token } = useSelector((state) => state.user)

  // Récupère le profil si token présent mais user vide (refresh)
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUserProfile())
    }
  }, [token, user, dispatch])

  const handleLogout = () => {
    dispatch(logout())
    navigate("/sign-in", { replace: true })
  }

  const displayName = user?.userName?.trim() || user?.firstName?.trim() || "User"

  return (
    <nav className="main-nav">
      <Link className="main-nav-logo" to="/">
        <img className="main-nav-logo-image" src={logo} alt="Argent Bank Logo" />
        <h1 className="sr-only">Argent Bank</h1>
      </Link>

      <div>
        {!isAuthenticated ? (
          <Link className="main-nav-item" to="/sign-in">
            <i className="fa fa-user-circle"></i>
            Sign In
          </Link>
        ) : (
          <>
            <Link className="main-nav-item" to="/user">
              <i className="fa fa-user-circle"></i>
              {displayName}
            </Link>

            <button onClick={handleLogout} className="main-nav-item">
              <i className="fa fa-sign-out"></i>
              Sign Out
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Header
