import { QueryClient, QueryClientProvider } from "react-query";
import ErrorSnackbar from "./components/ErrorSnackbar";
import ListContainer from "./components/ListContainer";
import Navbar from "./components/Navbar";
import ErrorProvider from "./components/providers/ErrorProvider";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorProvider>
        <Navbar />
        <ListContainer />
        <ErrorSnackbar />
      </ErrorProvider>
    </QueryClientProvider>
  );
}

export default App;
