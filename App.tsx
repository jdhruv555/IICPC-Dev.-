import React, { useState } from 'react';
import AppLayout from './components/AppLayout';
import ArchitectPanel from './components/ArchitectPanel';
import SimulationKiosk from './components/SimulationKiosk';
import { AppMode } from './types';

function App() {
  // Default to Architect mode
  const [mode, setMode] = useState<AppMode>(AppMode.ARCHITECT);

  return (
    <AppLayout mode={mode} setMode={setMode}>
      {mode === AppMode.ARCHITECT && <ArchitectPanel />}
      {mode === AppMode.SIMULATION && <SimulationKiosk />}
    </AppLayout>
  );
}

export default App;
