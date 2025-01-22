import { RouterProvider } from "react-router-dom";
import ToastWrapper from './routes/ToastWrapper';
import { router } from './routes';

function App() {

  return (
    <>
      <RouterProvider router={router} />
      <ToastWrapper />
    </>
  )
}

export default App
