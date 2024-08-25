import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"
import NavBar from "./components/NavBar"
import Footer from "./components/Footer"
import Landing from "./pages/Landing"
import Authentication from "./pages/Authentication"
import Logout from "./pages/Logout"
import VideoMeet from "./pages/VideoMeet"

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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="authentication" element={<Authentication />} />
          <Route path="logout" element={<Logout />} />
        </Route>
        <Route path="/:url" element={<VideoMeet />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App