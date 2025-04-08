import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/AuthPage/LoginPage";
import GuestAuth from "../guards/GuestGuard";
import { ErrorPage } from "../pages/ErrorPage/ErrorPage";
import { LayoutDH } from "../layout/layout/LayoutDH";
import { HomeDH } from "../pages/HomePage/HomeDH";
import { ProjectsDH } from "../pages/ProjectsPage/ProjectsDH";
import RoleBasedGuard from "../guards/RoleBasedGuard";
import ForgotPasswordPage from "../pages/AuthPage/ForgotPasswordPage";
import { RelatedProjects } from "../pages/ProjectsPage/RelatedProjects";
import ViewProfilePage from "../pages/ViewProfilePage/ViewProfilePage";
import { LayoutAdmin } from "../layout/layout/LayoutAdmin";
import { HomeAdmin } from "../pages/HomePage/HomeAdmin";
import ChangePasswordPage from "../pages/ViewProfilePage/ChangePasswordPage";
import AccountManagementPage from "../pages/AccountManagementPage/AccountManagementPage";
import { ErrorPageDH } from "../pages/ErrorPage/ErrorPageDH";
import { ErrorPageAdmin } from "../pages/ErrorPage/ErrorPageAdmin";
import { ErrorPageLogin } from "../pages/ErrorPage/ErrorPageLogin";
import { Projectsloader as projectLoader, ProjectDetailsLoader as projectDetailLoader } from "../services/ProjectsApi";
import ClassDetailPage from "../pages/ClassDetailPage/ClassDetailPage";
import MaterialManagementPage from "../pages/MaterialManagementPage/MaterialManagementPage";
import MemberManagementPage from "../pages/MemberManagementPage/MemberManagementPage";
import { LayoutLecturer } from "../layout/layout/LayoutLecturer";
import { HomeLecturer } from "../pages/HomePage/HomeLecturer";
import { ErrorPageLecturer } from "../pages/ErrorPage/ErrorPageLecturer";
import { LayoutStudent } from "../layout/layout/LayoutStudent";
import { ErrorPageStudent } from "../pages/ErrorPage/ErrorPageStudent";
import { HomeStudent } from "../pages/HomePage/HomeStudent";
import { ProjectDetailPage } from "../pages/ProjectDetailPage/ProjectDetail";
import { AvailableProjects } from "../pages/ProjectsPage/AvailableProjects";
import { MyRegistrationPage } from "../pages/RegistrationPage/MyRegistrationPage";
import { ProjectRegistrationPage } from "../pages/RegistrationPage/ProjectRegistrationPage";
import { ChatLayout } from "../components/Chat/ChatLayout/ChatLayout";
import { ChatContent } from "../components/Chat/ChatContent/ChatContent";
import { ProjectLog } from "../pages/ProjectsPage/ProjectLog";
import { MyClasses } from "../pages/Classes/MyClasses";
import { LayoutTrainee } from "../layout/layout/LayoutTrainee";
import { ErrorPageTrainee } from "../pages/ErrorPage/ErrorPageTrainee";
import { HomeTrainee } from "../pages/HomePage/HomeTrainee";
import { DashboardPMPage } from "../pages/DashboardPage/DashboardPMPage";
import { ChangeClassPage } from "../pages/Classes/ChangeClassPage";
import { SchedulePage } from "../pages/SchedulePage/SchedulePage";
import { LayoutBR } from "../layout/layout/LayoutBR";
import { HomeBR } from "../pages/HomePage/HomeBR";
import { ErrorPageBR } from "../pages/ErrorPage/ErrorPageBR";
import { LayoutAssociate } from "../layout/layout/LayoutAssociate";
import { HomeAssociate } from "../pages/HomePage/HomeAssociate";
import { ErrorPageAssociate } from "../pages/ErrorPage/ErrorPageAssociate";



export const router = createBrowserRouter([
  
  //Path for Guest
  {
    path: "/",
    element: <GuestAuth><LoginPage /></GuestAuth>,
    errorElement: <ErrorPageLogin />
  },


  //Path for Department Head
  {
    path: "/home-department-head",
    element: <RoleBasedGuard accessibleRoles={['Department Head']} status="active"><LayoutDH /></RoleBasedGuard>,
    errorElement: <ErrorPageDH />,
    children: [
      {
        index: true,
        element: <HomeDH />
      },
      {
        path: "projects",
        element: <ProjectsDH />,
        loader: projectLoader,
        errorElement: <ErrorPageDH />
      },
      {
        path: "project-detail/:projectId",
        element: <ProjectDetailPage />,
        loader: projectDetailLoader,
        errorElement: <ErrorPageDH />
      },
      {
        path: "view-profile",
        element: <ViewProfilePage />,
        errorElement: <ErrorPageDH />
      },
      {
        path: "class-detail/:projectId/:classId",
        element: <ClassDetailPage />,
        errorElement: <ErrorPageDH />
      },
      {
        path: "project-detail/:projectId/material",
        element: <MaterialManagementPage />,
        errorElement: <ErrorPageDH />
      },
      {
        path: "project-detail/:projectId/member-list",
        element: <MemberManagementPage />,
        errorElement: <ErrorPageDH />
      },
      {
        path: "project-detail/:projectId/project-log",
        element: <ProjectLog />,
        errorElement: <ErrorPageDH />
      },
      {
        path: "*", // Bắt tất cả các đường dẫn không xác định trong 
        element: <ErrorPageDH />,
      }
    ]
  },


  //Path for Lecturer
  {
    path: "/home-lecturer",
    element: <RoleBasedGuard accessibleRoles={['Lecturer']} status="active"><LayoutLecturer /></RoleBasedGuard>,
    errorElement: <ErrorPageLecturer />,
    children: [
      {
        index: true,
        element: <HomeLecturer />,
        errorElement: <ErrorPageLecturer />
      },
      {
        path: "all-related-projects",
        element: <RelatedProjects />,
        errorElement: <ErrorPageLecturer />
      },
      {
        path: "all-available-projects",
        element: <AvailableProjects />,
        errorElement: <ErrorPageLecturer />
      },
      {
        path: "project-detail/:projectId",
        element: <ProjectDetailPage />,
        loader: projectDetailLoader,
        errorElement: <ErrorPageLecturer />
      },
      {
        path: 'project-registration/:projectId',
        element: <ProjectRegistrationPage />,
        errorElement: <ErrorPageLecturer />
      },
      {
        path: "my-registration",
        element: <MyRegistrationPage />,
        errorElement: <ErrorPageLecturer />
      },
      {
        path: "my-classes",
        element: <MyClasses />,
        errorElement: <ErrorPageLecturer />
      },
      {
        path: "my-schedule",
        element: <SchedulePage />,
        errorElement: <ErrorPageLecturer />
      },
      {
        path: "class-detail/:projectId/:classId",
        element: <ClassDetailPage />,
        errorElement: <ErrorPageLecturer />
      },
      {
        path: "project-detail/:projectId/material",
        element: <MaterialManagementPage />,
        errorElement: <ErrorPageLecturer />
      },
      {
        path: "project-detail/:projectId/member-list",
        element: <MemberManagementPage />,
        errorElement: <ErrorPageLecturer />
      },
      {
        path: "project-detail/:projectId/project-log",
        element: <ProjectLog />,
        errorElement: <ErrorPageLecturer />
      },
      {
        path: "chat",
        element: <ChatLayout />,
        errorElement: <ErrorPageLecturer />,
        children: [
          {
            index: true,
            element: <ChatContent />,
          },
          {
            path: ":classId",
            element: <ChatContent />,
          }
        ]
      },
      {
        path: "view-profile",
        element: <ViewProfilePage />,
        errorElement: <ErrorPageLecturer />
      },
      {
        path: "change-password",
        element: <ChangePasswordPage />,
        errorElement: <ErrorPageLecturer />
      },
      {
        path: "dashboard",
        element: <DashboardPMPage />,
        errorElement: <ErrorPageLecturer />
      },
      {
        path: "*", // Bắt tất cả các đường dẫn không xác định 
        element: <ErrorPageLecturer />
      },
    ]
  },

  //Path for Student
  {
    path: "/home-student",
    element: <RoleBasedGuard accessibleRoles={['Student']} status="active"><LayoutStudent /></RoleBasedGuard>,
    errorElement: <ErrorPageStudent />,
    children: [
      {
        index: true,
        element: <HomeStudent />,
        errorElement: <ErrorPageStudent />
      },
      {
        path: "all-related-projects",
        element: <RelatedProjects />,
        errorElement: <ErrorPageStudent />
      },
      {
        path: "all-available-projects",
        element: <AvailableProjects />,
        errorElement: <ErrorPageStudent />
      },
      {
        path: "project-detail/:projectId",
        element: <ProjectDetailPage />,
        loader: projectDetailLoader,
        errorElement: <ErrorPageStudent />
      },
      {
        path: "project-detail/:projectId/material",
        element: <MaterialManagementPage />,
        errorElement: <ErrorPageStudent />
      },
      {
        path: "my-registration",
        element: <MyRegistrationPage />,
        errorElement: <ErrorPageStudent />
      },
      {
        path: "my-schedule",
        element: <SchedulePage />,
        errorElement: <ErrorPageStudent />
      },
      {
        path: "my-classes",
        element: <MyClasses />,
        errorElement: <ErrorPageStudent />
      },
      {
        path: "class-detail/:projectId/:classId",
        element: <ClassDetailPage />,
        errorElement: <ErrorPageStudent />
      },
      {
        path: "chat",
        element: <ChatLayout />,
        errorElement: <ErrorPageStudent />,
        children: [
          {
            index: true,
            element: <ChatContent />,
          },
          {
            path: ":classId",
            element: <ChatContent />,
          }
        ]
      },
      {
        path: "view-profile",
        element: <ViewProfilePage />,
        errorElement: <ErrorPageStudent />
      },
      {
        path: "change-password",
        element: <ChangePasswordPage />,
        errorElement: <ErrorPageStudent />
      },
      {
        path: "*", // Bắt tất cả các đường dẫn không xác định 
        element: <ErrorPageStudent />
      },
    ]
  },

  //Path for Trainee
  {
    path: "/home-trainee",
    element: <RoleBasedGuard accessibleRoles={['Trainee']} status="active"><LayoutTrainee /></RoleBasedGuard>,
    errorElement: <ErrorPageTrainee />,
    children: [
      {
        index: true,
        element: <HomeTrainee />,
        errorElement: <ErrorPageTrainee />
      },
      {
        path: "all-related-projects",
        element: <RelatedProjects />,
        errorElement: <ErrorPageTrainee />
      },
      {
        path: "project-detail/:projectId",
        element: <ProjectDetailPage />,
        loader: projectDetailLoader,
        errorElement: <ErrorPageTrainee />
      },
      {
        path: "project-detail/:projectId/material",
        element: <MaterialManagementPage />,
        errorElement: <ErrorPageTrainee />
      },
      {
        path: "my-schedule",
        element: <SchedulePage />,
        errorElement: <ErrorPageTrainee />
      },
      {
        path: "my-classes",
        element: <MyClasses />,
        errorElement: <ErrorPageTrainee />
      },
      {
        path: "change-class",
        element: <ChangeClassPage />,
        errorElement: <ErrorPageTrainee />
      },
      {
        path: "class-detail/:projectId/:classId",
        element: <ClassDetailPage />,
        errorElement: <ErrorPageTrainee />
      },
      {
        path: "chat",
        element: <ChatLayout />,
        errorElement: <ErrorPageTrainee />,
        children: [
          {
            index: true,
            element: <ChatContent />,
          },
          {
            path: ":classId",
            element: <ChatContent />,
          }
        ]
      },
      {
        path: "view-profile",
        element: <ViewProfilePage />,
        errorElement: <ErrorPageTrainee />
      },
      {
        path: "change-password",
        element: <ChangePasswordPage />,
        errorElement: <ErrorPageTrainee />
      },
      {
        path: "*", // Bắt tất cả các đường dẫn không xác định 
        element: <ErrorPageTrainee />
      },
    ]
  },

  //Path for Business Relation
  {
    path: "/home-business-relation",
    element: <RoleBasedGuard accessibleRoles={['Business Relation']} status="active"><LayoutBR /></RoleBasedGuard>,
    errorElement: <ErrorPageBR />,
    children: [
      {
        index: true,
        element: <HomeBR />,
        errorElement: <ErrorPageBR />
      },
      {
        path: "projects",
        element: <ProjectsDH />,
        loader: projectLoader,
        errorElement: <ErrorPageBR />
      },
      {
        path: "project-detail/:projectId",
        element: <ProjectDetailPage />,
        loader: projectDetailLoader,
        errorElement: <ErrorPageBR />
      },
      {
        path: "project-detail/:projectId/material",
        element: <MaterialManagementPage />,
        errorElement: <ErrorPageBR />
      },
      {
        path: "class-detail/:projectId/:classId",
        element: <ClassDetailPage />,
        errorElement: <ErrorPageBR />
      },
      {
        path: "view-profile",
        element: <ViewProfilePage />,
        errorElement: <ErrorPageBR />
      },
      {
        path: "change-password",
        element: <ChangePasswordPage />,
        errorElement: <ErrorPageBR />
      },
      {
        path: "*", // Bắt tất cả các đường dẫn không xác định 
        element: <ErrorPageBR />
      },
    ]
  },

  //Path for Associate
  {
    path: "/home-associate",
    element: <RoleBasedGuard accessibleRoles={['Associate']} status="active"><LayoutAssociate /></RoleBasedGuard>,
    errorElement: <ErrorPageAssociate />,
    children: [
      {
        index: true,
        element: <HomeAssociate />,
        errorElement: <ErrorPageAssociate />
      },
      {
        path: "all-related-projects",
        element: <RelatedProjects />,
        errorElement: <ErrorPageAssociate />
      },
      {
        path: "project-detail/:projectId",
        element: <ProjectDetailPage />,
        loader: projectDetailLoader,
        errorElement: <ErrorPageAssociate />
      },
      {
        path: "project-detail/:projectId/material",
        element: <MaterialManagementPage />,
        errorElement: <ErrorPageAssociate />
      },
      {
        path: "class-detail/:projectId/:classId",
        element: <ClassDetailPage />,
        errorElement: <ErrorPageAssociate />
      },
      {
        path: "view-profile",
        element: <ViewProfilePage />,
        errorElement: <ErrorPageAssociate />
      },
      {
        path: "change-password",
        element: <ChangePasswordPage />,
        errorElement: <ErrorPageAssociate />
      },
      {
        path: "*", // Bắt tất cả các đường dẫn không xác định 
        element: <ErrorPageAssociate />
      },
    ]
  },


  //Path for Admin
  {
    path: "/home-admin",
    element: <RoleBasedGuard accessibleRoles={['Admin']} status="active" > <LayoutAdmin /></RoleBasedGuard>,
    errorElement: <ErrorPageAdmin />,
    children: [
      {
        index: true,
        element: <HomeAdmin />,
        errorElement: <ErrorPageAdmin />
      },
      {
        path: "view-profile",
        element: <ViewProfilePage />,
        errorElement: <ErrorPageAdmin />
      },
      {
        path: "change-password",
        element: <ChangePasswordPage />,
        errorElement: <ErrorPageAdmin />
      },
      {
        path: "account-management",
        element: <AccountManagementPage />,
        errorElement: <ErrorPageAdmin />
      },
      {
        path: "*", // Bắt tất cả các đường dẫn không xác định 
        element: <ErrorPageAdmin />
      }
    ]
  },


  //Path for forgot password
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
    errorElement: <ErrorPage />
  },

  // {
  //   path: "*",
  //   element: <ErrorPage />,
  // }
]);

