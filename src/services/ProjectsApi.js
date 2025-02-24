const baseUrl = process.env.REACT_APP_API_URL;
// load tất cả dự án
export async function loadProjects() {

  const response = await fetch(
    `${baseUrl}/api/Project/all-project`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
    },
  }
  );
  if (!response.ok) {
    throw new Response(
      JSON.stringify({ message: response.json().message }),
      {
        status: response.json().statusCode,
      }
    );
  } else {
    const resData = await response.json();
    console.log(resData);
    return resData.result;
  }
}
export function Projectsloader() {
  return {
    projects: loadProjects(),
  };
}


// load chi tiết dự án
export async function loadProjectDetails(id) {
  const response = await fetch(`${baseUrl}/api/Project/project-detail?projectId=` + id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
    },
  })
  if (!response.ok) {
    throw new Response(
      JSON.stringify({ message: "Không thể lấy thông tin của dự án được chọn." }),
      {
        status: 500,
      }
    );
  } else {
    const resData = await response.json();
    console.log(resData);
    return resData.result;
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
      throw new Error('Không thể vô hiệu hóa dự án.');
    }
  } catch (error) {
    console.error(error);
    throw error
  }
}


// load dự án liên quan
export async function loadRelatedProjects(accountId) {
  const response = await fetch(
    `${baseUrl}/api/Project/all-related-project?userId=${accountId}`, {
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
  return resData.result;
}


// load dự án có sẵn với người dùng
export async function loadAvailableProjects() {

  const response = await fetch(
    `${baseUrl}/api/Project/available-project`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
    },
  }
  );
  if (!response.ok) {
    throw new Response(
      JSON.stringify({ message: response.json().message }),
      {
        status: response.json().statusCode,
      }
    );
  } else {
    const resData = await response.json();
    console.log(resData);
    return resData.result;
  }
}
export function AvailableProjectsloader() {
  return {
    projects: loadAvailableProjects(),
  };
}