const baseUrl = process.env.REACT_APP_API_URL;

export const GetAllLecturerOfProject = async (projectId, searchValue, pageNumber, rowsPerPage) => {
    try {
        var url = `${baseUrl}/api/Lecturer/all-lecturer-of-project?projectId=${projectId}&pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}&searchValue=${searchValue}`;
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
}

export const RemoveLecturerFromClass = async (lecturerId, classId) => {
    try {
        var url = `${baseUrl}/api/Lecturer/lecturer?lecturerId=${lecturerId}&classId=${classId}`;
        const request = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        };
        const response = await fetch(url, request);
        return response;
    } catch (err) {
        console.log(err);
    }
}

export async function ChangeLecturerStudentToClass(data) {
  console.log(data);
  try {
    const response = await fetch(`${baseUrl}/api/Class/remove-update-class`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json(); // Lấy dữ liệu lỗi từ API
      throw new Error(errorData.result||errorData.message || errorData.error || "Lỗi không xác định từ API");
    }
    console.log(response);
    return response;

  } catch (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
}

