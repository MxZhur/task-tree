import { Route, Routes } from "react-router-dom";
import "./App.css";
import { MainPage } from "./pages";
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<MainPage />} />
      </Route>
    </Routes>
  );
}

export default App;
