const baseUrl = process.env.REACT_APP_API_URL;

export async function getAllQuestionOfProject(searchValue) {
  try {
    const response = await fetch(`${baseUrl}/api/Question/all-question-of-project?searchValue=${searchValue}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
      },
    })

    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.message || "Lỗi không xác định từ API");
      error.result = errorData.result;
      throw error;
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
}

export async function createQuestionOfProject(questionContent, data) {
  try {
    const response = await fetch(`${baseUrl}/api/Question/new-question?questionContent=${questionContent}`, {
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
      error.result = errorData.result;
      throw error;
    }

    console.log(response);
    return response;

  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
}

export async function updateQuestionOfProject(questionId, questionContent, data) {
  try {
    const response = await fetch(`${baseUrl}/api/Question/question-of-project?questionId=${questionId}&questionContent=${questionContent}`, {
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
      error.result = errorData.result;
      throw error;
    }

    console.log(response);
    return response;

  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
}

export async function deleteQuestionOfProject(questionId) {
  try {
    const response = await fetch(`${baseUrl}/api/Question/question-of-project?questionId=${questionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
      },
    })

    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.message || "Lỗi không xác định từ API");
      error.result = errorData.result;
      throw error;
    }

    console.log(response);
    return response;

  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
}

export async function deleteAnswerOfQuestion(answerId) {
  try {
    const response = await fetch(`${baseUrl}/api/Answer/Answer?answerId=${answerId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
      },
    })

    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.message || "Lỗi không xác định từ API");
      error.result = errorData.result;
      throw error;
    }

    console.log(response);
    return response;

  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
}

export async function TraineeFeedbackOfProject(accountId, projectId, feebackContent, data) {
  try {
    const response = await fetch(`${baseUrl}/api/TraineeFeedback/new-feedback?accountId=${accountId}&projectId=${projectId}&feebackContent=${feebackContent}`, {
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
      error.result = errorData.result;
      throw error;
    }

    console.log(response);
    return response;

  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
}
