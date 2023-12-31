import {NextUIProvider} from '@nextui-org/react'
import Front from "./pages/front.tsx"
function App() {
  return (
    <>
    <NextUIProvider>
      <Front/>
    </NextUIProvider>
    </>
  );
}

export default App;
