import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/AuthPage/LoginPage";
import GuestAuth from "../guards/GuestGuard";
import { ErrorPage } from "../pages/ErrorPage/ErrorPage";
import { LayoutDH } from "../layout/layout/LayoutDH";
import { HomeDH } from "../pages/HomePage/HomeDH";
import { ProjectsDH } from "../pages/ProjectsPage/ProjectsDH";
import RoleBasedGuard from "../guards/RoleBasedGuard";
import ForgotPasswordPage from "../pages/AuthPage/ForgotPasswordPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <GuestAuth><LoginPage /></GuestAuth>,
    errorElement: <ErrorPage />
  },
  {
    path: "/home-department-head",
    element: <LayoutDH />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomeDH />
      },
      {
        path: "projects",
        element: <ProjectsDH />
      }
    ]
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
    errorElement: <ErrorPage />
  },
]);

