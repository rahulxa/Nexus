import { BrowserRouter, Routes, Route } from "react-router-dom"
import NavBar from "./components/NavBar"
import Footer from "./components/Footer"
import Landing from "./pages/Landing"
import Authentication from "./pages/Authentication"
import Logout from "./pages/Logout"

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/authentication" element={<Authentication />}></Route>
          <Route path="/logout" element={<Logout />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
