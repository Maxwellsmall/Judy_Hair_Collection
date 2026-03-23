import {Routes, Route} from "react-router-dom"
import StaticLayout from "../layout/StaticLayout"
import Home from '../pages/Home'

const AllScreen = () => {
  return (
    <>
    <Routes>

        <Route path='' element={<StaticLayout/>}>
            <Route index element={<Home/>} />
        </Route>
    </Routes>
    </>
  )
}

export default AllScreen