const baseUrl = process.env.REACT_APP_API_URL;

export const GetAllAccount = async (pageNumber, rowsPerPage, searchValue) => {
  try {
    const url = `${baseUrl}/api/Account/all-accounts?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}&searchValue=${searchValue}`;
    const request = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    const response = await fetch(url, request);
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const CreateAccount = (data) => {
  const formData = new FormData();
  formData.append("AccountName", data.accountName);
  formData.append("FullName", data.fullName);
  formData.append("Phone", data.phone);
  formData.append("Address", data.address);
  formData.append("Email", data.email);
  formData.append("DateOfBirth", data.dateOfBirth);
  formData.append("Gender", data.gender);
  formData.append("RoleId", data.role);

  const url = `${baseUrl}/api/Auth/new-account`;
  const request = {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      accept: "*/*",
    },
  };

  return fetch(url, request)
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

export const ImportAccount = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const url = `${baseUrl}/api/Account/import-account`;
  const request = {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      accept: "*/*",
    },
  };

  return fetch(url, request)
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

export const CreateAssociateAccount = (data) => {
  const formData = new FormData();
  formData.append("AccountName", data.accountName);
  formData.append("FullName", data.fullName);
  formData.append("Phone", data.phone);
  formData.append("Address", data.address);
  formData.append("Email", data.email);
  formData.append("DateOfBirth", data.dateOfBirth);
  formData.append("Gender", data.gender);
  formData.append("AssociateName", data.associateName);

  const url = `${baseUrl}/api/Associate/new-associate`;
  const request = {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      accept: "*/*",
    },
  };

  return fetch(url, request)
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

export async function updateAccountAvatar(accountId, formData) {
  const response = await fetch(
    `${baseUrl}/api/Account/avatar?accountId=${accountId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Upload avatar failed:", errorData);

    const error = new Error(errorData.message || "Lỗi khi cập nhật ảnh");
    error.result = errorData.result || [];
    throw error;
  }

  return response.json();
}

export const UpdateProfile = async (data) => {
  try {
    const url = `${baseUrl}/api/Account/profile`;
    const request = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, request);
    return response;
  } catch (err) {
    console.log(err);
  }
};