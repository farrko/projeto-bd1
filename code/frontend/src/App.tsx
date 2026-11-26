import { Routes, Route, Navigate } from 'react-router'
import { AppShell } from './components/layout/AppShell'
import { UsersPage } from './pages/users/UsersPage'
import { ClassesPage } from './pages/classes/ClassesPage'

const App = () => {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={ <Navigate to="/users" replace /> } />
        <Route path="/users" element={ <UsersPage /> } />
        <Route path="/assignments" element={<div>Assignments</div>} />
        <Route path="/assessments" element={<div>Assessments</div>} />
        <Route path="/questions" element={<div>Question Bank</div>} />
        <Route path="/classes" element={ <ClassesPage /> } />
      </Routes>
    </AppShell>
  )
}

export default App;
