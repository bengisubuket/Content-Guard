import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import ExtensionFrame from './components/extension-comp/ExtensionFrame'
import BlockersComponent from './components/blockers/Blockers';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login/Login';
import Reports from './components/reports/Reports';
import KeywordBlockerComponent from './components/keyword-blocker/KeywordBlocker';
import CategoryBlockerComponent from './components/category-blocker/CategoryBlocker';
import Timer from "./components/timer/Timer"

function App() {
  
    return (
        <Router>
            <Routes>
                <Route path="" element={<ExtensionFrame />} />
                <Route path="/login" element={<Login/>}/>
                <Route path="/blockers" element={<BlockersComponent />} />
                <Route path="/reports" element={<Reports/>}/>
                <Route path="/blockers/keyword-blocker" element={<KeywordBlockerComponent/>}/>
                <Route path="/blockers/category-blocker" element={<CategoryBlockerComponent/>}/>
                <Route path="/blockers/timer" element={<Timer/>}/>
            </Routes>
        </Router>
    )
}

export default App
