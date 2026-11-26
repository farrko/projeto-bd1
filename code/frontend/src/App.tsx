import { Routes, Route, Navigate } from 'react-router'
import { AppShell } from './components/layout/AppShell'
import { UsersPage } from './pages/users/UsersPage'
import { ClassesPage } from './pages/classes/ClassesPage'
import { QuestionsPage } from './pages/questions/QuestionsPage'

const App = () => {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={ <Navigate to="/users" replace /> } />
        <Route path="/users" element={ <UsersPage /> } />
        <Route path="/assignments" element={<div>Assignments</div>} />
        <Route path="/assessments" element={<div>Assessments</div>} />
        <Route path="/questions" element={ <QuestionsPage /> } />
        <Route path="/classes" element={ <ClassesPage /> } />
      </Routes>
    </AppShell>
  )
}

export default App;
