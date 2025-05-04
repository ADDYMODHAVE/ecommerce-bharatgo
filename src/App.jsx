import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store";
import AppRoutes from "./routes";
import GlobalLoader from "./components/GlobalLoader";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <GlobalLoader />
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
