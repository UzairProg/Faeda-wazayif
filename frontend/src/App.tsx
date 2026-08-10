import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { MainLayout } from "./layouts/MainLayout"
import { Home } from "./features/public/pages/Home"
import { Login } from "./features/auth/pages/Login"
import { JobList } from "./features/jobs/pages/JobList"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="jobs" element={<JobList />} />
          <Route path="register" element={<div className="p-8 text-center">Register Page (Coming Soon)</div>} />
          <Route path="companies" element={<div className="p-8 text-center">Companies Page (Coming Soon)</div>} />
          <Route path="teams" element={<div className="p-8 text-center">Teams Page (Coming Soon)</div>} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
