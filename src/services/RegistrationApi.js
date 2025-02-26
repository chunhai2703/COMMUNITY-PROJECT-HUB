const baseUrl = process.env.REACT_APP_API_URL;

export async function loadMyRegistrations(accountId) {
  const response = await fetch(
    `${baseUrl}/api/Registration/registrations?accountId=${accountId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
    },
  }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Response(JSON.stringify({ message: errorData.message }), {
      status: errorData.statusCode,
    });
  }

  const resData = await response.json();
  return resData;
}

export const GetAllRegistrationOfProject = async (projectId, searchValue, pageNumber, rowsPerPage) => {
  try {
    var url = `${baseUrl}/api/Registration/registrations-of-project?projectId=${projectId}&pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}&search=${searchValue}`;
    const request = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    };
    const response = await fetch(url, request);
    return response;
  } catch (err) {
    console.log(err);
  }
};

export async function createRegistration(payload) {
  const response = await fetch(`${baseUrl}/api/Registration/new-registration`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error details:", errorData);

    // Kiểm tra nếu có mảng `result`
    if (errorData.result && Array.isArray(errorData.result)) {
      throw new Error(errorData.result.join("\n")); // Gộp các lỗi thành chuỗi xuống dòng
    }

    throw new Error(errorData.message);
  }

}

export async function removeRegistration(registrationId) {
  console.log("Hủy đơn đăng ký với ID:", registrationId);

  const response = await fetch(`${baseUrl}/api/Registration/canceled-registration`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
    },
    body: JSON.stringify(registrationId),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error details:", errorData);

    // Kiểm tra nếu có mảng `result`
    if (errorData.result && Array.isArray(errorData.result)) {
      throw new Error(errorData.result.join("\n")); // Gộp các lỗi thành chuỗi xuống dòng
    }

    throw new Error((errorData.message || "Lỗi không xác định"));
  }

}

export async function approveDenyRegistration(payload) {
  const response = await fetch(`${baseUrl}/api/Registration/registration`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error details:", errorData);

    // Kiểm tra nếu có mảng `result`
    if (errorData.result && Array.isArray(errorData.result)) {
      throw new Error(errorData.result.join("\n")); // Gộp các lỗi thành chuỗi xuống dòng
    }

    throw new Error((errorData.message || "Lỗi không xác định"));
  }

}