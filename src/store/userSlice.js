import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// LOGIN : changes state and stores token in localStorage
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await fetch("http://localhost:3001/api/v1/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()
      if (!response.ok) return thunkAPI.rejectWithValue(data.message)

      localStorage.setItem("token", data.body.token)

      return data.body
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

// FETCH USER PROFILE : changes state with user profile data
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState()
      const token = state.user.token
      if (!token) return thunkAPI.rejectWithValue("Utilisateur non authentifié")

      const response = await fetch("http://localhost:3001/api/v1/user/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

// UPDATE USERNAME : changes state with updated username
export const updateUsername = createAsyncThunk(
  "user/updateUsername",
  async (newUsername, thunkAPI) => {
    try {
      const state = thunkAPI.getState()
      const token = state.user.token
      if (!token) return thunkAPI.rejectWithValue("Utilisateur non authentifié")

      const response = await fetch("http://localhost:3001/api/v1/user/profile", {
        method: "PUT",
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

// INITIAL STATE
const initialState = {
  token: localStorage.getItem("token") || null,
  user: null,
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  error: null,
}

// SLICE
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem("token")
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
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

      // FETCH PROFILE
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

      // UPDATE USERNAME
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

export const { logout } = userSlice.actions
export default userSlice.reducer
