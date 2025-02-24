const baseUrl = process.env.REACT_APP_API_URL;

export const GetAllAccount = async (pageNumber, rowsPerPage, searchValue) => {
    try {
        const url = `${baseUrl}/api/Account/all-accounts?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}&searchValue=${searchValue}`;
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

export const CreateAccount = (data) => {
    const formData = new FormData();
    formData.append('AccountName', data.accountName);
    formData.append('FullName', data.fullName);
    formData.append('Phone', data.phone);
    formData.append('Address', data.address);
    formData.append('Email', data.email);
    formData.append('DateOfBirth', data.dateOfBirth);
    formData.append('Gender', data.gender);
    formData.append('RoleId', data.role);

    const url = `${baseUrl}/api/Auth/new-account`;
    const request = {
        method: 'POST',
        body: formData,
        headers: {
            'accept': '*/*',
        },
    };

    return fetch(url, request)
        .then(response => {
            return response;
        })
        .catch(err => {
            console.error(err);
            throw err;
        });
};

export const ImportAccount = (file) => {
    const formData = new FormData();
    console.log(file)
    formData.append('file', file);

    const url = `${baseUrl}/api/Account/import-account`;
    const request = {
        method: 'POST',
        body: formData,
        headers: {
            'accept': '*/*',
        },
    };

    return fetch(url, request)
        .then(response => {
            return response;
        })
        .catch(err => {
            console.error(err);
            throw err;
        });
};