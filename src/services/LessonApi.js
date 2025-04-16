const baseUrl = process.env.REACT_APP_API_URL;
export async function updateLesson(payload) {
  console.log("Gửi request:", JSON.stringify(payload, null, 2));

  const response = await fetch(`${baseUrl}/api/Lesson`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error details:", errorData);
    throw new Error("Không thể cập nhật nội dung khóa học: " + errorData.message);
  }

  return response.json();
}
