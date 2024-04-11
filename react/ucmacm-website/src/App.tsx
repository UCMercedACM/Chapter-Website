import { Route, Routes } from "react-router-dom";
import Front from "./pages/front.tsx";
import Sigs from "./pages/sigs.tsx";
import Events from "./pages/events.tsx";

function App() {
  return (
    <>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Front />} />
        <Route path="/sigs" element={<Sigs />}/>
        <Route path="/events" element={<Events />} />

      </Routes>
    </>
  );
}

export default App;
