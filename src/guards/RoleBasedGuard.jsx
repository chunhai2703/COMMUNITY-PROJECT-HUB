import PropTypes from 'prop-types';
import { Container, Alert, AlertTitle, CircularProgress } from '@mui/material';
import useAuth from '../hooks/useAuth';

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
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px' }}>
        <CircularProgress />
      </Container>
    );
  }

  // If user is null or does not have the right role, deny access
  if (!user || !accessibleRoles.includes(currentRole)) {
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>Permission Denied</AlertTitle>
          You do not have permission to access this page
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
}
