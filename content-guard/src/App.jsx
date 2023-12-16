import './App.css'
import ExtensionFrame from './components/extension-comp/ExtensionFrame'
import BlockersComponent from './components/blockers/Blockers';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login/Login';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ExtensionFrame />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/blockers" element={<BlockersComponent />} />
      </Routes>
    </Router>
  )
}

export default App
