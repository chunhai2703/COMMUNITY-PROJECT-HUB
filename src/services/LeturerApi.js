const baseUrl = process.env.REACT_APP_API_URL;
export async function searchLeturers(searchTerm) {
  const response = await fetch(`${baseUrl}/api/Lecturer/search-lecturer?searchValue=${searchTerm}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
    }
  })
  if (!response.ok) {
    throw new Response(
      JSON.stringify({ message: "Không tìm thấy giáo viên." }),
      {
        status: 500,
      }
    );
  } else {
    const resData = await response.json();
    return resData.result;
  }
}