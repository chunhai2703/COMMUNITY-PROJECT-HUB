const baseUrl = process.env.REACT_APP_API_URL;

export async function getSchedule(accountId) {
  try {
    const response = await fetch(
      `${baseUrl}/api/Schedule/schedule?accountId=${accountId}`, {
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
    return resData

  } catch (error) {
    console.error("Lỗi khi lấy thời khóa biểu:", error);
    throw error; // Ném lỗi để component xử lý
  }

}