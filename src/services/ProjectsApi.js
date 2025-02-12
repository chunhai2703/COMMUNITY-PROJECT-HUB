
export async function loadProjects() {

  const response = await fetch(
    'http://localhost:5145/api/Project/all-project', {
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

export async function loadProjectDetails(id) {
  const response = await fetch('http://localhost:5145/api/Project/project-detail?projectId=' + id, {
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
export async function createProject(formData) {
  console.log(formData);

  const response = await fetch('http://localhost:5145/api/Project/new-project', {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
    },
    body: formData,
  });

  if (!response.ok) {

    const errorData = await response.json();
    console.error("Error details:", errorData);
    throw new Error("Không thể tạo dự án: " + errorData.message);

  }

  console.log(response.json());
  return response.json();
}

export async function updateProject(formData) {
  console.log(formData);
  const response = await fetch('http://localhost:5145/api/Project/project', {
    method: 'PUT',
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error details:", errorData);
    throw new Error("Không thể cập nhật dự án: " + errorData.message);
  }
  return response.json();
}

export async function unActiveProject(id) {
  try {
    const response = await fetch(`http://localhost:5145/api/Project/inactivated-project?projectID=${id}`, {
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
