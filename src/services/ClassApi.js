const baseUrl = process.env.REACT_APP_API_URL;

export const GetAllClassOfProject = async (projectId, searchValue, pageNumber, rowsPerPage) => {
    try {
        var url = `${baseUrl}/api/Class/all-class-of-project?projectId=${projectId}&pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}&searchValue=${searchValue}`;
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
};

export const GetClassDetail = async (classId) => {
    try {
        var url = `${baseUrl}/api/Class/class-detail?classId=${classId}`;
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
};

export const GetAllLessonClassOfClass = async (classId) => {
    try {
        var url = `${baseUrl}/api/LessonClass/lessons-of-class?classId=${classId}`;
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
};

export const UpdateLessonClass= async (projectId, data) => {
    try {
        var url = `${baseUrl}/api/LessonClass/lesson-of-class?projectId=${projectId}`;
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
};