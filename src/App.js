import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import { connect } from "react-redux";
import { getDarkMode } from "./redux/selectors";
import ListContainer from "./components/ListContainer";
import Navbar from "./components/Navbar";

function App({darkMode}) {
  const currentTheme  = darkMode ? "dark" : "light";
  const theme = createMuiTheme({ palette: { type: currentTheme } });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <ListContainer />
    </ThemeProvider>
  );
}
const mapStateToProps = state => {
  const darkMode = getDarkMode(state);
  return { darkMode };
};

export default connect(mapStateToProps)(App);
