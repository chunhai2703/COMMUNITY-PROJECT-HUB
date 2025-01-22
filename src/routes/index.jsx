import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/AuthPage/LoginPage";
import GuestAuth from "../guards/GuestGuard";
import Error from "../components/global/Error";
import HomeStudentPage from "../pages/HomePage/HomeStudent";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <GuestAuth><LoginPage /></GuestAuth>,
    errorElement: <Error />
  },
  {
    path: "/home-student",
    element: <HomeStudentPage />,
    errorElement: <Error />
  },
]);

