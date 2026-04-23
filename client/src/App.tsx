import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
} from '@mui/material'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { DashboardPage } from './pages/DashboardPage'
import { RoomsPage } from './pages/RoomsPage'
import { RoomDetailPage } from './pages/RoomDetailPage'
import { useWsEvents } from './hooks/useWsEvents'
import { USER_ID } from './api/config'
import { LoginPage } from './pages/LoginPage'

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

function Layout() {
  useWsEvents()

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
      >
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar />
        </AppBar>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/rooms" element={<RoomsPage userId={USER_ID} />}>
            <Route
              path=":roomId"
              element={<RoomDetailPage userId={USER_ID} />}
            />
          </Route>
        </Routes>
      </Box>
    </Box>
  )
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<Layout />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
