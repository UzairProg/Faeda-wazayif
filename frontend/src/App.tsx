import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { MainLayout } from "./layouts/MainLayout"
import { Home } from "./features/public/pages/Home"
import { Login } from "./features/auth/pages/Login"
import { Register } from "./features/auth/pages/Register"
import { JobList } from "./features/jobs/pages/JobList"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="jobs" element={<JobList />} />
          <Route path="companies" element={<div className="p-8 text-center">Companies Page (Coming Soon)</div>} />
          <Route path="teams" element={<div className="p-8 text-center">Teams Page (Coming Soon)</div>} />
        </Route>
        
        {/* Standalone Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App
