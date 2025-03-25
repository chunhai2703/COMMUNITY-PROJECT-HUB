import PropTypes from 'prop-types';
import { Container, Alert, AlertTitle } from '@mui/material';
import useAuth from '../hooks/useAuth';
import { Spinner } from '../components/Spinner/Spinner';
import { Button, Result } from 'antd';

RoleBasedGuard.propTypes = {
  accessibleRoles: PropTypes.array, // Example ['admin', 'leader']
  children: PropTypes.node
};

export default function RoleBasedGuard({ accessibleRoles, children }) {
  const { isInitialized, user } = useAuth();

  const currentRole = user?.roleName || "Null";
  console.log("Accessible Roles:", accessibleRoles);
  console.log("Current Role:", currentRole);

  // Show loading spinner while the authentication state is initializing
  if (!isInitialized) {
    return (
      <Spinner />
    );
  }

  // If user is null or does not have the right role, deny access
  if (!user || !accessibleRoles.includes(currentRole)) {
    return (
      <Result
      status="403"
      title="Quyền truy cập bị từ chối"
      subTitle="Xin lỗi, bạn không có quyền truy cập vào trang này."
      extra={<Button type="primary" onClick={() => window.location.href = '/'}>Quay lại</Button>}
    />
    );
  }

  return <>{children}</>;
}
