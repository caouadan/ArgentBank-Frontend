import { useSelector, useDispatch } from "react-redux"
import { useState, useEffect } from "react"
import { fetchUserProfile, updateUsername } from "../store/userSlice"

function User() {
  const dispatch = useDispatch()
  const { user, isLoading, error, token } = useSelector((state) => state.user)

  const [isEditing, setIsEditing] = useState(false)
  const [usernameInput, setUsernameInput] = useState(user?.userName || "")

  // Fetch profile si token existant et user non encore chargé
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUserProfile())
    }
  }, [token, user, dispatch])

  /* useEffect(() => {
  if (user) {
    console.log("User name:", user.userName)
  }
}, [user]) */

  const displayName = user ? `${user.firstName} ${user.lastName}` : "User"

  const handleEditClick = () => {
    setUsernameInput(user?.userName || "")
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!usernameInput.trim()) return
    dispatch(updateUsername(usernameInput))
    setIsEditing(false)
  }

  return (
    <main className="main bg-dark">
      <div className="header">
  {!isEditing ? (
    <>
      <h1>
        Welcome back<br />
        {displayName}!
      </h1>
      <button className="edit-button" onClick={handleEditClick}>
        Edit Name
      </button>
    </>
  ) : (
    <form className="edit-form" onSubmit={handleSave}>
      <h2>Edit user info</h2>

      <div className="form-group">
        <label>User name:</label>
        <input
          type="text"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label>First name:</label>
        <input type="text" value={user?.firstName || ""} disabled />
      </div>

      <div className="form-group">
        <label>Last name:</label>
        <input type="text" value={user?.lastName || ""} disabled />
      </div>

      <div className="form-buttons">
        <button type="submit" disabled={isLoading}>
          Save
        </button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </div>

      {error && <p className="form-error">{error}</p>}
    </form>
  )}
</div>

      <h2 className="sr-only">Accounts</h2>

      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Checking (x8349)</h3>
          <p className="account-amount">$2,082.79</p>
          <p className="account-amount-description">Available Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>

      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Savings (x6712)</h3>
          <p className="account-amount">$10,928.42</p>
          <p className="account-amount-description">Available Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>

      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Credit Card (x8349)</h3>
          <p className="account-amount">$184.30</p>
          <p className="account-amount-description">Current Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
    </main>
  )
}

export default User
