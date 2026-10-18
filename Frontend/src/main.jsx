import { createRoot } from "react-dom/client";
import "./index.css";
import AppRoute from "./routes/AppRoute.jsx";
import { Provider } from "react-redux";
import { store } from "./app/store.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <AppRoute />
    </Provider>
  </QueryClientProvider>,
);
