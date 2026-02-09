import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout, fetchUserProfile } from "../store/userSlice"
import { useEffect } from "react"
import logo from "../assets/img/argentBankLogo.png"

function Header() {
  // useDispatch pour dispatcher les actions du store (besoin du logout et du fetchUserProfile)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // useSelector pour accéder à l'état d'authentification, du user et du token dans le store
  const { isAuthenticated, user, token } = useSelector((state) => state.user)

  // Récupère le profil si token présent mais user vide (refresh)
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUserProfile())
    }
  }, [token, user, dispatch])

  // supprime token et données utilisateur du store et du localStorage et go to sign-in
  const handleLogout = () => {
    dispatch(logout())
    navigate("/sign-in", { replace: true })
  }

  // Affiche le nom d'utilisateur s'il existe, sinon affiche "User"
  const displayName = user?.userName?.trim() || user?.firstName?.trim() || "User"

  return (
    <nav className="main-nav">
      <Link className="main-nav-logo" to="/">
        <img className="main-nav-logo-image" src={logo} alt="Argent Bank Logo" />
        <h1 className="sr-only">Argent Bank</h1>
      </Link>

      <div>
        {!isAuthenticated ? ( // Si l'utilisateur n'est pas authentifié, affiche lien de connexion
          <Link className="main-nav-item" to="/sign-in">
            <i className="fa fa-user-circle"></i>
            Sign In
          </Link>
        ) : ( // sinon afficher le nom de l'utilisateur et le bouton de déconnexion
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
