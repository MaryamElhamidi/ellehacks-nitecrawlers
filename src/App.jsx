import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ScanScreen from './pages/ScanScreen';
import ChoiceScreen from './pages/ChoiceScreen';
import ConsequenceScreen from './pages/ConsequenceScreen';
import ParentView from './pages/ParentView';

// Placeholders until pages are built
function Placeholder({ name }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 h-full text-center space-y-4">
      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl">🚧</div>
      <h2 className="text-xl font-bold text-stone-700">{name}</h2>
      <p className="text-stone-500 text-sm max-w-xs">This screen is under construction by the Nooklings.</p>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ScanScreen />} />
          <Route path="/choice" element={<ChoiceScreen />} />
          <Route path="/consequence" element={<ConsequenceScreen />} />
          <Route path="/parent" element={<ParentView />} />

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
