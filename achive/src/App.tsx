import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import FeedbackForm from './components/FeedbackForm'
import BadgePage from './components/BadgePage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FeedbackForm />} />
        <Route path="/badge/:id" element={<BadgePage />} />
      </Routes>
    </Router>
  )
}

export default App
