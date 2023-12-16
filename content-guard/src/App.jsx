import './App.css'
import ExtensionFrame from './components/extension-comp/ExtensionFrame'
import BlockersComponent from './components/blockers/Blockers';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login/Login';
import Reports from './components/reports/Reports';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ExtensionFrame />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/blockers" element={<BlockersComponent />} />
        <Route path="/reports" element={<Reports/>}/>
      </Routes>
    </Router>
  )
}

export default App
