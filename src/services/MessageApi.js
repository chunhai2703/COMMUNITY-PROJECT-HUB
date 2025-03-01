const baseUrl = process.env.REACT_APP_API_URL;

export const GetChatClasses = async (searchValue, accountId) => {
    try {
        const url = `${baseUrl}/api/Message/chat-classes?searchValue=${searchValue}&accountId=${accountId}`;
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

export const GetMessage = async (accountId, classId) => {
    try {
        const url = `${baseUrl}/api/Message/messages?accountId=${accountId}&classId=${classId}`;
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

export const CreateMessage = async (data) => {
    try {
        const url = `${baseUrl}/api/Message/message`;
        const request = {
            method: "POST",
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