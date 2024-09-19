import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"
import store from "./store/store"
import { Provider } from "react-redux"
import NavBar from "./components/NavBar"
import Footer from "./components/Footer"
import Landing from "./pages/Landing"
import Authentication from "./pages/Authentication"
import Logout from "./pages/Logout"
import Home from "./pages/Home"
import VideoMeet from "./pages/VideoMeet"
import JoinAsGuest from "./pages/JoinAsGuest"

function Layout() {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  )
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="authentication" element={<Authentication />} />
            <Route path="logout" element={<Logout />} />
            <Route path="join-as-guest" element={<JoinAsGuest />} />
          </Route>
          <Route path="home" element={<Home />} />
          <Route path="/:url" element={<VideoMeet />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App