import './App.css'
import { HomePage } from './pages/HomePage'
import {Routes, Route} from 'react-router'
import { Policy } from './components/Policy'
import { UserLoginPage } from './pages/UserLoginPage'
import { JudgeLoginPage } from './pages/JudgeLoginPage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { LoginForm } from './components/LoginForm'
import { UserPage } from './pages/UserPage'
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
      <Route path='user-login-page' element={<UserLoginPage />}/>
      <Route path='judge-login-page' element={<JudgeLoginPage />} />
      <Route path='admin-login-page' element={<AdminLoginPage />} />
      <Route path='user-login-page/form-valid' element={<LoginForm />} />
      <Route path='user-login-page/userPage' element={<UserPage />} />
      <Route path='judge-login-page/judgePage' element={<div>Judge main page</div>} />
      <Route path='admin-login-page/adminPage' element={<div>Admin main page</div>} />
    </Routes>
    </>
  )
}

export default App
