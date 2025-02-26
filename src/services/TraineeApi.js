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