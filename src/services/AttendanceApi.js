const baseUrl = process.env.REACT_APP_API_URL;
export async function getAllTraineesAttendance(classId) {
  try {
    const response = await fetch(
      `${baseUrl}/api/Attendance/class-attendance?classId=${classId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.result ||
          errorData.message ||
          errorData.error ||
          "Lỗi không xác định từ API"
      );
    }
    console.log(response);
    return response;
  } catch (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
}

export const exportTraineeAttendanceTemplate = async (classId) => {
  try {
    const url = `${baseUrl}/api/Attendance/export-attendance-template?classId=${classId}`;
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, request);
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const exportTraineeAttendance = async (classId) => {
  try {
    const url = `${baseUrl}/api/Attendance/export-attendance?classId=${classId}`;
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, request);
    return response;
  } catch (err) {
    console.log(err);
  }
};

export async function importAttendanceTrainee(classId, formData) {
  console.log(classId, formData);
  try {
    const response = await fetch(
      `${baseUrl}/api/Attendance/import-attendance-file?classId=${classId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: formData,
      }
    );

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
