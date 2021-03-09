import { CssBaseline } from "@material-ui/core";
import { QueryClient, QueryClientProvider } from "react-query";
import ListContainer from "./components/ListContainer";
import Navbar from "./components/Navbar";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <CssBaseline />
      <Navbar />
      <ListContainer />
    </QueryClientProvider>
  );
}

export default App;
