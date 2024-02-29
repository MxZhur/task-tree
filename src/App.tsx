import { Route, Routes } from "react-router-dom";
import "./App.css";
import { MainPage, TaskForm } from "./pages";
import Layout from "./components/Layout";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<MainPage />}>
        </Route>
        <Route path="new" element={<TaskForm />} />
        <Route path="edit/:taskId" element={<TaskForm />} />
      </Route>
    </Routes>
  );
}

export default App;
