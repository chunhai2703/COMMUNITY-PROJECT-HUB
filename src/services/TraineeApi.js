const baseUrl = process.env.REACT_APP_API_URL;

export const GetAllTraineeOfClass = async (classId, searchValue, pageNumber, rowsPerPage, filterField, filterOrder) => {
    try {
        var url = `${baseUrl}/api/Trainee/all-trainee?classId=${classId}&pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}&searchValue=${searchValue}&filterField=${filterField}&filterOrder=${filterOrder}`;
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

export const GetAllTraineeScoreList = async (classId) => {
    try {
        var url = `${baseUrl}/api/Trainee/score-trainee-list?classId=${classId}`;
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

export const UpdateScoreTraineeList = async (data) => {
    try {
        var url = `${baseUrl}/api/Trainee/update-trainee-score`;
        const request = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        };
        const response = await fetch(url, request);
        return response;
    } catch (err) {
        console.log(err);
    }
}

export async function submitReportTrainee(accountId, classId, formData) {
    console.log(accountId, classId, formData);
    try {
        const response = await fetch(`${baseUrl}/api/Trainee/trainee-report?accountId=${accountId}&classId=${classId}`, {
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            },
            body: formData,
        })

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.result || errorData.message || errorData.error || "Lỗi không xác định từ API");
        }
        console.log(response);
        return response;

    } catch (error) {
        console.error(error.message);
        throw new Error(error.message);
    }
}

export const ExportTraineeList = async (classId) => {
    try {
        var url = `${baseUrl}/api/Trainee/export-trainee?classId=${classId}`;
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
}

export const RemoveTrainee = async (classId, accountId, reason) => {
    try {
        var url = `${baseUrl}/api/Trainee/trainee?classId=${classId}&accountId=${accountId}&reason=${reason}`;
        const request = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        };
        const response = await fetch(url, request);
        return response;
    } catch (err) {
        console.log(err);
    }
}