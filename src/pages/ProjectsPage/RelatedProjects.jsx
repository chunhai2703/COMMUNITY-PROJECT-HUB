import React, { useState, useEffect } from "react";
import { Spinner } from "../../components/Spinner/Spinner";
import { AllRelatedProjects } from "../../components/Projects/AllProjects/AllRelatedProjects";
import useAuth from "../../hooks/useAuth";
import { loadRelatedProjects } from "../../services/ProjectsApi";

export const RelatedProjects = () => {
  const [currentRelatedProjects, setCurrentRelatedProjects] = useState(null); 
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.accountId) return;

    const fetchRelatedProjects = async () => {
      try {
        const data = await loadRelatedProjects(user.accountId);
        setCurrentRelatedProjects(data || []); 
      } catch (error) {
        console.error("Lỗi lấy dự án:", error);
        setCurrentRelatedProjects([]); 
      }
    };

    fetchRelatedProjects();
  }, [user?.accountId]);

  // Hiển thị Spinner khi dữ liệu chưa tải xong
  if (currentRelatedProjects === null) {
    return <Spinner />;
  }

  return <AllRelatedProjects projects={currentRelatedProjects} />;
};
