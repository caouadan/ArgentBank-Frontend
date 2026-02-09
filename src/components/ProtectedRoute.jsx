// COMPONENT DE ROUTE PROTEGEE POUR PROTEGER LES PAGES QUI NECESSITENT UNE AUTHENTIFICATION
import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"

function ProtectedRoute({ children }) { // children représente le composant à protéger (user)
  const isAuthenticated = useSelector( // useSelector accéde à l'état d'auth du user dans le store
    (state) => state.user.isAuthenticated
  )

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />
  }

  return children
}

export default ProtectedRoute
