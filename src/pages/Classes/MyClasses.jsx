import React, { useEffect, useState } from 'react'
import { AllClasses } from '../../components/Classes/AllClasses'
import useAuth from '../../hooks/useAuth';
import { Spinner } from '../../components/Spinner/Spinner';
import { getAllClassesOfLecturer, getAllClassesOfStudent, getAllClassesOfTrainee } from '../../services/ClassApi';

export const MyClasses = () => {
  const [currentClasses, setCurrentClasses] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.accountId) return;

    const fetchAvailableProjects = async () => {
      try {
        if (user.roleId === 1) {
          const data = await getAllClassesOfStudent(user.accountId, '');
          setCurrentClasses(data.result || []);
        } else if (user.roleId === 2) {
          const data = await getAllClassesOfLecturer(user.accountId, user.accountId);
          setCurrentClasses(data.result || []);
        } else if (user.roleId === 3) {
          const data = await getAllClassesOfTrainee(user.accountId, '');
          setCurrentClasses(data.result || []);
        }

      } catch (error) {
        console.error("Lỗi lớp của giảng viên:", error);
        setCurrentClasses([]);
      }
    };

    fetchAvailableProjects();
  }, [user?.accountId, user?.roleId]);

  // Hiển thị Spinner khi dữ liệu chưa tải xong
  if (currentClasses === null) {
    return <Spinner />;
  }

  return <AllClasses classes={currentClasses} />;

}
