const baseUrl = process.env.REACT_APP_API_URL;

// Load tất cả dự án
export async function loadProjects() {
  try {
    const response = await fetch(`${baseUrl}/api/Project/all-project`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
      },
    });

    // Đọc JSON chỉ một lần
    const resData = await response.json();

    if (!response.ok) {
      throw new Response(
        JSON.stringify({ message: resData.message }),
        {
          status: resData.statusCode,
        }
      );
    }

    console.log(resData);
    return resData.result;

  } catch (error) {
    console.error("Lỗi khi lấy dự án:", error);
    throw error; // Ném lỗi để component xử lý
  }
}

// Loader phải chờ dữ liệu trước khi trả về
export async function Projectsloader() {
  return {
    projects: await loadProjects(), // Sử dụng await để nhận dữ liệu thực tế
  };
}


// load chi tiết dự án
export async function loadProjectDetails(id) {
  try {
    const response = await fetch(`${baseUrl}/api/Project/project-detail?projectId=` + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
      },
    })

    const resData = await response.json();

    if (!response.ok) {
      throw new Response(
        JSON.stringify({ message: resData.message }),
        {
          status: resData.statusCode,
        }
      );
    }

    console.log(resData);
    return resData.result;

  } catch (error) {
    console.error("Lỗi khi lấy chi tiết dự án:", error);
    throw error; // Ném lỗi để component xử lý
  }

}
export function ProjectDetailsLoader({ params }) {
  const projectId = params.projectId;
  return {
    project: loadProjectDetails(projectId),
  };
}


// tạo dự án
export async function createProject(formData) {
  console.log(formData);

  const response = await fetch(`${baseUrl}/api/Project/new-project`, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error details:", errorData);

    // Tạo một đối tượng `Error` với message là JSON.stringify để giữ thông tin lỗi
    const error = new Error(errorData.message || "Không thể tạo dự án");
    error.result = errorData.result || []; // Thêm `result` vào đối tượng lỗi

    throw error;
  }

  return response.json();
}



// cập nhật dự án
export async function updateProject(formData) {
  console.log(formData);
  const response = await fetch(`${baseUrl}/api/Project/project`, {
    method: 'PUT',
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error details:", errorData);

    // Kiểm tra nếu có mảng `result`
    if (errorData.result && Array.isArray(errorData.result)) {
      throw new Error(errorData.result.join("\n")); // Gộp các lỗi thành chuỗi xuống dòng
    }

    throw new Error("Không thể cập nhật dự án: " + (errorData.message || "Lỗi không xác định"));
  }

  return response.json();

}


// vô hiệu hóa dự án
export async function unActiveProject(id) {
  try {
    const response = await fetch(`${baseUrl}/api/Project/inactivated-project?projectID=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });


    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.result || errorData.message || errorData.error || "Lỗi không xác định");
    }
  } catch (error) {
    console.error(error);
    throw error
  }
}


// load dự án liên quan
export async function loadRelatedProjects(accountId) {
  try {
    const response = await fetch(
      `${baseUrl}/api/Project/all-related-project?userId=${accountId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
    );

    const resData = await response.json();

    if (!response.ok) {
      throw new Response(
        JSON.stringify({ message: resData.message }),
        {
          status: resData.statusCode,
        }
      );
    }

    console.log(resData);
    return resData.result;

  } catch (error) {
    console.error("Lỗi khi lấy các dự án liên quan:", error);
    throw error; // Ném lỗi để component xử lý
  }

}


// load dự án có sẵn với người dùng
export async function loadAvailableProjects(accountId) {
  try {
    const response = await fetch(
      `${baseUrl}/api/Project/available-project?userId=${accountId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
      },
    }
    );
    // Đọc JSON chỉ một lần
    const resData = await response.json();

    if (!response.ok) {
      throw new Response(
        JSON.stringify({ message: resData.message }),
        {
          status: resData.statusCode,
        }
      );
    }

    console.log(resData);
    return resData.result;

  } catch (error) {
    console.error("Lỗi khi lấy dự án:", error);
    throw error; // Ném lỗi để component xử lý
  }

}

export async function getProjectLog(projectId, searchValue, pageNumber, rowsPerPage) {
  try {
    const response = await fetch(`${baseUrl}/api/ProjectLogging/all-project-logging?projectId=${projectId}&searchValue=${searchValue}&pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response
  } catch (error) {
    console.error("Lỗi khi lấy log của dự án:", error);
    throw error; // Ném lỗi để component xử lý
  }
}

export async function toUpComingProject(projectId) {
  try {
    const response = await fetch(`${baseUrl}/api/Project/to-up-coming-status?projectId=${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
      },
    })
    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData.message || "Lỗi không xác định từ API");
    }

    console.log("Trạng thái dự án cập nhật thành công:", resData);
    return resData;

  } catch (error) {
    console.error("❌ Lỗi khi chuyển trạng thái dự án:", error.message);
    throw new Error(error.message || "Có lỗi xảy ra khi chuyển trạng thái");
  }


}
