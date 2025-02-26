const baseUrl = process.env.REACT_APP_API_URL;

export const GetAllANotification = async (accountId) => {
    try {
        const url = `${baseUrl}/api/Notification/notifications?accountId=${accountId}`;
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
