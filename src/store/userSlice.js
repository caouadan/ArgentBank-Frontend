// reducer (etat actuel + actions) et gestion des actions asynchrones
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// ACTION ASYNC DE CONNEXION
export const loginUser = createAsyncThunk(
  // Nom de l'action utilisé par Redux
  "user/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await fetch("http://localhost:3001/api/v1/user/login", {
        method: "POST", // soumission du formulaire de connexion
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials), // credentials = email + password
      })

      const data = await response.json()
      // Si la réponse n'est pas ok, rejeter l'action avec le message d'erreur du backend
      if (!response.ok) return thunkAPI.rejectWithValue(data.message)
        // Stocker le token dans le localStorage pour persister la connexion
        localStorage.setItem("token", data.body.token)
        // Retourner les données du token pour mettre à jour le state de l'utilisateur
        return data.body
    // En cas d'erreur réseau ou autre, rejeter l'action avec le message d'erreur
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

// ACTION ASYNC POUR RECUPERER LE PROFIL UTILISATEUR CONNECTE
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (_, thunkAPI) => { // Pas de paramètre car on utilise le token pour identifier l'utilisateur
    try {
      const state = thunkAPI.getState() // Récupérer l'état actuel du store pour accéder au token
      const token = state.user.token // Récupérer le token de l'utilisateur depuis le state
      if (!token) return thunkAPI.rejectWithValue("Utilisateur non authentifié")

      const response = await fetch("http://localhost:3001/api/v1/user/profile", {
        method: "GET", // récupération du profil de l'utilisateur connecté
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Envoi du token dans l'en-tête Authorization
        },
      })

      const data = await response.json()
      if (!response.ok) return thunkAPI.rejectWithValue(data.message)

      return data.body
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

// ACTION ASYNC POUR METTRE A JOUR LE NOM D'UTILISATEUR
export const updateUsername = createAsyncThunk(
  "user/updateUsername",
  async (newUsername, thunkAPI) => {
    try {
      const state = thunkAPI.getState()
      const token = state.user.token
      if (!token) return thunkAPI.rejectWithValue("Utilisateur non authentifié")

      const response = await fetch("http://localhost:3001/api/v1/user/profile", {
        method: "PUT", // remplacement du nom d'utilisateur dans le profil de l'utilisateur connecté
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userName: newUsername }),
      })

      const data = await response.json()
      if (!response.ok) return thunkAPI.rejectWithValue(data.message)

      return data.body
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

// ETAT INITIAL DE L'UTILISATEUR
const initialState = {
  token: localStorage.getItem("token") || null, // récupérer le token
  user: null,
  isAuthenticated: !!localStorage.getItem("token"), // est authentifié s'il y a un token
  isLoading: false,
  error: null,
}

// SLICE DE L'UTILISATEUR (CONNEXION, PROFIL, MISE A JOUR DU NOM D'UTILISATEUR)
const userSlice = createSlice({
  name: "user", // Nom du slice
  initialState, // Etat initial de l'utilisateur
  reducers: {
    logout: (state) => { // Action de déconnexion
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem("token")
    },
  },
  // Gestion des actions asynchrones avec les cas pour chaque étape de chaque action async
  extraReducers: (builder) => {
    builder // construction des actions
      // LOGIN USER (connexion de l'utilisateur)
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // FETCH PROFILE USER (récupération du profil de l'utilisateur connecté)
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // UPDATE USERNAME (mise à jour du nom d'utilisateur)
      .addCase(updateUsername.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateUsername.fulfilled, (state, action) => {
        state.isLoading = false
        if (state.user) state.user.userName = action.payload.userName
      })
      .addCase(updateUsername.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

// action logout exportée pour être utilisée dans les composants
export const { logout } = userSlice.actions

// reducer à brancher dasns le store redux
export default userSlice.reducer
