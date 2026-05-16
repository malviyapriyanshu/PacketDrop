import Dashboard from './pages/Dashboard';
import { ToastProvider } from './components/Toast';
import './index.css';

export default function App() {
  return (
    <ToastProvider>
      <Dashboard />
    </ToastProvider>
  );
}
