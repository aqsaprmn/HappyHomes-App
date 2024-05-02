import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import TimesheetPage from "./pages/Timesheet";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="" element={<TimesheetPage />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
