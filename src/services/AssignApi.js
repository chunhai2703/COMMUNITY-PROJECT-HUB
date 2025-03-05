const baseUrl = process.env.REACT_APP_API_URL;
export async function searchLeturers(searchTerm) {
  try {
    const response = await fetch(`${baseUrl}/api/Lecturer/search-lecturer?searchValue=${searchTerm}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
      }
    })
    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData.message);
    }

    console.log(resData);
    return resData;

  } catch (error) {
    console.error(error.message);
    throw new Error(error.message);
  }

}

export async function searchLecturersForPM(searchTerm, projectId) {
  try {
    const response = await fetch(`${baseUrl}/api/Lecturer/search-lecturer-assigning-pm?searchValue=${searchTerm}&projectId=${projectId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
      }
    })
    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData.message);
    }
    return resData;

  } catch (error) {
    console.error(error.message);
    throw new Error(error.message);
  }

}

export async function searchStudents(searchTerm) {
  try {
    const response = await fetch(`${baseUrl}/api/Member/search-student-assigning-to-class?searchValue=${searchTerm}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
      }
    })
    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData.message);
    }

    console.log(resData);
    return resData;

  } catch (error) {
    console.error(error.message);
    throw new Error(error.message);
  }

}

export async function assignPMToProject(projectId, accountId) {
  console.log(projectId, accountId);
  try {
    const response = await fetch(`${baseUrl}/api/Project/assign-pm-to-project?projectId=${projectId}&accountId=${accountId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json(); // Lấy dữ liệu lỗi từ API
      throw new Error(errorData.message || errorData.error || "Lỗi không xác định từ API");
    }
    console.log(response);
    return response;

  } catch (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
}

export async function assignLecturerStudentToProject(data) {
  console.log(data);
  try {
    const response = await fetch(`${baseUrl}/api/Class/updated-class`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json(); // Lấy dữ liệu lỗi từ API
      throw new Error(errorData.message || errorData.error || "Lỗi không xác định từ API");
    }
    console.log(response);
    return response;

  } catch (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
}

