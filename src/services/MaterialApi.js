const baseUrl = process.env.REACT_APP_API_URL;

export const GetAllMaterial = async (projectId, searchValue, pageNumber, rowsPerPage) => {
    try {
        var url = `${baseUrl}/api/Material/all-material-of-project?projectId=${projectId}&pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}&searchValue=${searchValue}`;
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

export const CreateMaterial = async (data, projectId) => {
    try {
        var url = `${baseUrl}/api/Material/new-material`;
        const formData = new FormData();
        formData.append("Title", data.title);
        formData.append("ProjectId", projectId);
        if (data.file?.[0]) {
            formData.append("File", data.file[0]);
        }

        const request = {
            method: "POST",
            headers: {
                'accept': '*/*',
            },
            body: formData
        };
        const response = await fetch(url, request);
        return response;
    } catch (err) {
        console.log(err);
    }
}

export const UpdateMaterial = async (data, materialId, projectId) => {
    try {
        var url = `${baseUrl}/api/Material/material-of-project`;
        const formData = new FormData();
        formData.append("Title", data.title);
        formData.append("MaterialId", materialId);
        formData.append("ProjectId", projectId);
        if (data.file?.[0]) {
            formData.append("File", data.file[0]);
        }

        const request = {
            method: "PUT",
            headers: {
                'accept': '*/*',
            },
            body: formData
        };
        const response = await fetch(url, request);
        return response;
    } catch (err) {
        console.log(err);
    }
}

export const DeleteMaterial = async (materialId) => {
    try {
        var url = `${baseUrl}/api/Material/material-of-project?materialId=${materialId}`;
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