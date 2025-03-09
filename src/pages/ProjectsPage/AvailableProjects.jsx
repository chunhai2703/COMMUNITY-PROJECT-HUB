import React, { useEffect, useState } from "react";
import { Spinner } from "../../components/Spinner/Spinner";
import { AllAvailableProjects } from "../../components/Projects/AllProjects/AllAvailableProjects";
import useAuth from "../../hooks/useAuth";
import { loadAvailableProjects } from "../../services/ProjectsApi";


export const AvailableProjects = () => {
  const [currentAvailableProjects, setCurrentAvailableProjects] = useState(null); 
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.accountId) return;

    const fetchAvailableProjects = async () => {
      try {
        const data = await loadAvailableProjects(user.accountId);
        setCurrentAvailableProjects(data || []); 
      } catch (error) {
        console.error("Lỗi lấy dự án:", error);
        setCurrentAvailableProjects([]); 
      }
    };

    fetchAvailableProjects();
  }, [user?.accountId]);

  // Hiển thị Spinner khi dữ liệu chưa tải xong
  if (currentAvailableProjects === null) {
    return <Spinner />;
  }

  return <AllAvailableProjects projects={currentAvailableProjects} />;
}
