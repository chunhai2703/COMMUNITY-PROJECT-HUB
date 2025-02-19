import React, { useState, useEffect} from 'react'
import { MyRegistration } from '../../components/Registration/MyRegistration'
import useAuth from '../../hooks/useAuth';
import { loadMyRegistrations } from '../../services/RegistrationApi';
import { Spinner } from '../../components/Spinner/Spinner';

export const MyRegistrationPage = () => {
  const [myRegistrations, setMyRegistrations] = useState(null); 
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.accountId) return;

    const fetchMyRegistrations = async () => {
      try {
        const data = await loadMyRegistrations(user.accountId);
        setMyRegistrations(data || []); 
      } catch (error) {
        console.error("Lỗi lấy dự án:", error);
        setMyRegistrations([]); 
      }
    };

    fetchMyRegistrations();
  }, [user?.accountId]);

  // Hiển thị Spinner khi dữ liệu chưa tải xong
  if (myRegistrations === null) {
    return <Spinner />;
  }

  return <MyRegistration registrations={myRegistrations} />;
}
