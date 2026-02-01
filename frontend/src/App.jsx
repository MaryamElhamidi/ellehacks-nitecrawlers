import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import Layout from './components/Layout';
import Onboarding from './pages/Onboarding';
import ScanScreen from './pages/ScanScreen';
import ChoiceScreen from './pages/ChoiceScreen';
import ConsequenceScreen from './pages/ConsequenceScreen';
import ProfileScreen from './pages/ProfileScreen';
import DictionaryScreen from './pages/DictionaryScreen';

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
    <GameProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/scan" element={<ScanScreen />} />
            <Route path="/choice" element={<ChoiceScreen />} />
            <Route path="/consequence" element={<ConsequenceScreen />} />
            <Route path="/dictionary" element={<DictionaryScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </GameProvider>
  )
}

export default App
