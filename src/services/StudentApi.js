const baseUrl = process.env.REACT_APP_API_URL;

export const GetAllStudentOfProject = async (projectId, searchValue, pageNumber, rowsPerPage) => {
    try {
        var url = `${baseUrl}/api/Member/all-member-of-project?projectId=${projectId}&pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}&searchValue=${searchValue}`;
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

export const RemoveStudentFromClass = async (memberId) => {
    try {
        var url = `${baseUrl}/api/Member/member?memberId=${memberId}`;
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