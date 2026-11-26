import { Routes, Route, Navigate } from 'react-router'
import { AppShell } from './components/layout/AppShell'
import { UsersPage } from './pages/users/UsersPage'
import { ClassesPage } from './pages/classes/ClassesPage'
import { QuestionsPage } from './pages/questions/QuestionsPage'
import { AssessmentsPage } from './pages/assessments/AssessmentsPage'
import { AssessmentDetailPage } from './pages/assessments/AssessmentDetailPage'
import { AssignmentsPage } from './pages/assignments/AssignmentsPage'
import { AssignmentDetailPage } from './pages/assignments/AssignmentDetailPage'

const App = () => {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={ <Navigate to="/users" replace /> } />
        <Route path="/users" element={ <UsersPage /> } />
        <Route path="/assignments" element={ <AssignmentsPage /> } />
        <Route path="/assignments/:assessmentId/:studentId" element={ <AssignmentDetailPage /> } />
        <Route path="/assessments" element={ <AssessmentsPage /> } />
        <Route path="/assessments/:id" element={ <AssessmentDetailPage /> } />
        <Route path="/questions" element={ <QuestionsPage /> } />
        <Route path="/classes" element={ <ClassesPage /> } />
      </Routes>
    </AppShell>
  )
}

export default App;