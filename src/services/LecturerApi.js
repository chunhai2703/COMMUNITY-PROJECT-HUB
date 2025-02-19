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