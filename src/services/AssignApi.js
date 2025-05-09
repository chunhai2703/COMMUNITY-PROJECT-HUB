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

export async function searchTrainees(searchTerm) {
  try {
    const response = await fetch(`${baseUrl}/api/Trainee/search-trainee-add-to-class?searchValue=${searchTerm}`, {
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

export async function searchAssociate(searchTerm) {
  try {
    const response = await fetch(`${baseUrl}/api/Associate/search-associate-to-add-project?searchValue=${searchTerm}`, {
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
      const errorData = await response.json();
      const error = new Error(errorData.message || "Lỗi không xác định từ API");
      error.result = errorData.result; // Gán result để sử dụng trong catch
      throw error;
    }

    console.log(response);
    return response;

  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
}
export async function addTraineeToClass(data) {
  console.log(data);
  try {
    const response = await fetch(`${baseUrl}/api/Trainee/trainee`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.message || "Lỗi không xác định từ API");
      error.result = errorData.result; // Gán result để sử dụng trong catch
      throw error;
    }

    console.log(response);
    return response;

  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
}

export async function addNewTraineeToClass(formData) {
  console.log(formData);
  try {
    const response = await fetch(`${baseUrl}/api/Trainee/new-account-of-trainee`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.message || "Lỗi không xác định từ API");
      error.result = errorData.result; // Gán result để sử dụng trong catch
      throw error;
    }

    console.log(response);
    return response;

  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
}

export async function changeClassOfTrainee(data) {
  console.log(data);
  try {
    const response = await fetch(`${baseUrl}/api/Trainee/trainee-moving-class`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json(); // Lấy dữ liệu lỗi từ API
      throw new Error(errorData.result || errorData.message || errorData.error || "Lỗi không xác định từ API");
    }
    console.log(response);
    return response;

  } catch (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
}

export async function changeGroupOfTrainee(data) {
  console.log(data);
  try {
    const response = await fetch(`${baseUrl}/api/Trainee/trainee-moving-group`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json(); // Lấy dữ liệu lỗi từ API
      throw new Error(errorData.result || errorData.message || errorData.error || "Lỗi không xác định từ API");
    }
    console.log(response);
    return response;

  } catch (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
}

