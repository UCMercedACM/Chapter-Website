import { Route, Routes } from "react-router-dom";
import Front from "./pages/front.tsx";
import Sigs from "./pages/sigs.tsx";
function App() {
  return (
    <>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Front />} />
        <Route path="/sigs" element={<Sigs />}/>

      </Routes>
    </>
  );
}

export default App;
