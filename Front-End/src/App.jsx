import './App.css'
import { Routes, Route } from 'react-router'
import { LandingPage } from './pages/LandingPage'
import { HomePage } from './pages/HomePage'
import { Policy } from './components/Policy'
import { UserLoginPage } from './pages/UserLoginPage'
import { UserSignupPage } from './pages/UserSignupPage'
import { JudgeLoginPage } from './pages/JudgeLoginPage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { LoginForm } from './components/LoginForm'
import { UserPage } from './pages/UserPage'
import { JudgePage } from './pages/JudgePage'
import { AdminPage } from './pages/AdminPage'
import { UserDashboard } from './pages/UserDashboard'
import { UserFileCasePage } from './pages/UserFileCasePage'
import { UserCheckStatusPage } from './pages/UserCheckStatusPage'
import { JudgeDashboard } from './pages/JudgeDashboard'
import { JudgeCasesPage } from './pages/JudgeCasesPage'
import { JudgeAnalyticsPage } from './pages/JudgeAnalyticsPage'
import { AdminDashboard } from './pages/AdminDashboard'
import { AdminAnalyticsPage } from './pages/AdminAnalyticsPage'
import { AdminManageRecordsPage } from './pages/AdminManageRecordsPage'
function App() {

  return (
    <>
    <Routes>
      {/* Landing and Auth Routes */}
      <Route path='/' element={<LandingPage />} />
      <Route path='/home' element={<HomePage />} />
      <Route path='/policy' element={<Policy />}/>
      <Route path='/terms-and-condition' element={<div>Terms and Condition page</div>}/>
      <Route path='/license' element={<div>License page</div>}/>
      <Route path='/contact' element={<div>Contact page</div>}/>
      <Route path='/blog' element={<div>Blog page</div>}/>
      
      {/* User Routes */}
      <Route path='/user-login' element={<UserLoginPage />}/>
      <Route path='/user-signup' element={<UserSignupPage />}/>
      <Route path='/user-dashboard' element={<UserDashboard />} />
      <Route path='/user-file-case' element={<UserFileCasePage />} />
      <Route path='/user-check-status' element={<UserCheckStatusPage />} />
      
      {/* Judge Routes */}
      <Route path='/judge-login-page' element={<JudgeLoginPage />} />
      <Route path='/judge-dashboard' element={<JudgeDashboard />} />
      <Route path='/judge-cases' element={<JudgeCasesPage />} />
      <Route path='/judge-analytics' element={<JudgeAnalyticsPage />} />
      
      {/* Admin Routes */}
      <Route path='/admin-login-page' element={<AdminLoginPage />} />
      <Route path='/admin-dashboard' element={<AdminDashboard />} />
      <Route path='/admin-analytics' element={<AdminAnalyticsPage />} />
      <Route path='/admin-manage-records' element={<AdminManageRecordsPage />} />
      
      {/* Legacy Routes for backward compatibility */}
      <Route path='/user-login-page' element={<UserLoginPage />}/>
      <Route path='/user-login-page/userPage' element={<UserPage />} />
      <Route path='/judge-login-page/judgePage' element={<JudgePage />} />
      <Route path='/admin-login-page/adminPage' element={<AdminPage />} />
    </Routes>
    </>
  )
}

export default App
