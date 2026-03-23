import {Routes, Route} from "react-router-dom"
import StaticLayout from "../layout/StaticLayout"
import Home from '../pages/Home'
import Contact from "../pages/Contact"
import About from "../pages/About"
import Hairstyles from "../pages/Hairstyles"
import Dashboard from "../pages/Admin/index"

const AllScreen = () => {
  return (
    <>
     <Routes>
      <Route path="/" element={<StaticLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="hairstyles" element={<Hairstyles />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      <Route path="/admin" element={<Dashboard />} />
    </Routes>
    </>
  )
}

export default AllScreen