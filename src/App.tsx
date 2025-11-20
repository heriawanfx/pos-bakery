import { ToastProvider } from './components/ui/ToastProvider';
import { AppRouter } from './router';

function App() {
  return (
    <ToastProvider>
      <AppRouter />
    </ToastProvider>
  );
}

export default App;
