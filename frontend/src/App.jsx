import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"
import store from "./store/store"
import { Provider } from "react-redux"
import NavBar from "./components/NavBar"
import Footer from "./components/Footer"
import Landing from "./pages/Landing"
import Authentication from "./pages/Authentication"
import Home from "./pages/Home"
import VideoMeet from "./pages/VideoMeet"
import JoinAsGuest from "./pages/JoinAsGuest"
import MeetingHistory from "./pages/MeetingHistory"

function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <NavBar />
      <div className="flex-grow bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url(back2.jpg)' }}>
        <div className="backdrop-blur-sm bg-black bg-opacity-25 min-h-full">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
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
            <Route path="join-as-guest" element={<JoinAsGuest />} />
          </Route>
          <Route path="home" element={<Home />} />
          <Route path="/:url" element={<VideoMeet />} />
          <Route path="/meeting-history" element={<MeetingHistory />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App