const baseUrl = process.env.REACT_APP_API_URL;

export const GetAmountOfLecturer = async () => {
    try {
        const url = `${baseUrl}/api/Dashboard/lecturer-amount`;
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

export const GetAmountOfStudent = async () => {
    try {
        const url = `${baseUrl}/api/Dashboard/student-amount`;
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

export const GetAmountOfTrainee = async (accountId) => {
    try {
        const url = `${baseUrl}/api/Dashboard/trainee-amount?accountId=${accountId}`;
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

export const GetAmountOfProject = async (accountId) => {
    try {
        const url = `${baseUrl}/api/Dashboard/project-amount?accountId=${accountId}`;
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

export const GetAmountProjectWithStatus = async (accountId) => {
    try {
        const url = `${baseUrl}/api/Dashboard/project-with-status-amount?accountId=${accountId}`;
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

export const GetAmountOfUser = async () => {
    try {
        const url = `${baseUrl}/api/Dashboard/user-amount`;
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

export const GetAmountOfUserByRole = async () => {
    try {
        const url = `${baseUrl}/api/Dashboard/user-with-role-amount`;
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