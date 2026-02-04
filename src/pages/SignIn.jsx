import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { loginUser, fetchUserProfile } from "../store/userSlice"
import { useNavigate } from "react-router-dom"

function SignIn() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isAuthenticated, isLoading, error } = useSelector(
    (state) => state.user
  )

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(
      loginUser({
        email: username,
        password,
      })
    )
  }

  // useEffect pour déclencher fetchUserProfile après login
  useEffect(() => {
    if (isAuthenticated) {
      // on récupère le profil une fois connecté
      dispatch(fetchUserProfile())
      navigate("/user") // redirection vers la page user
    }
  }, [isAuthenticated, dispatch, navigate])

  return (
    <main className="main bg-dark">
      <section className="sign-in-content">
        <i className="fa fa-user-circle sign-in-icon"></i>
        <h1>Sign In</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-remember">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember-me">Remember me</label>
          </div>

          <button className="sign-in-button" disabled={isLoading}>
            {isLoading ? "Connexion..." : "Sign In"}
          </button>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </section>
    </main>
  )
}

export default SignIn
