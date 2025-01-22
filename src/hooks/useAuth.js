import { useContext } from "react";
import { AuthContext } from "../store/AuthProvider";

//

// ----------------------------------------------------------------------

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
