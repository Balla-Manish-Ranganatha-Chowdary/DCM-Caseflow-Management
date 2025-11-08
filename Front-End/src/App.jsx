import './App.css'
import { HomePage } from './pages/HomePage'
import {Routes, Route} from 'react-router'
import { Policy } from './components/Policy'
import { LoginDropDown } from './components/LoginDropDown'
function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='policy' element={<Policy />}/>
      <Route path='terms-and-condition' element={<div>Terms and Condition page</div>}/>
      <Route path='license' element={<div>License page</div>}/>
      <Route path='contact' element={<div>Contact page</div>}/>
      <Route path='blog' element={<div>Blog page</div>}/>
    </Routes>
    </>
  )
}

export default App
