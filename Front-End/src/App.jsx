import './App.css'
import { HomePage } from './pages/HomePage'
import {Routes, Route} from 'react-router'
function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='policy' element={<div>Policy page</div>}/>
      <Route path='terms-and-condition' element={<div>Terms and Condition page</div>}/>
      <Route path='license' element={<div>License page</div>}/>
      <Route path='contact' element={<div>Contact page</div>}/>
      <Route path='login' element={<div>login-page</div>}/>
    </Routes>
    </>
  )
}

export default App
