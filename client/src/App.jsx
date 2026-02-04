import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Chat from './components/chat';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-wrapper">
        <Chat />
      </div>
    </QueryClientProvider>
  );
}

export default App;