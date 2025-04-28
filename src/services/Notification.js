const baseUrl = process.env.REACT_APP_API_URL;

export const GetAllNotification = async (accountId) => {
    try {
        const url = `${baseUrl}/api/Notification/notifications?accountId=${accountId}`;
        const request = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            }
        };
        const response = await fetch(url, request);
        return response;
    } catch (err) {
        console.log(err);
    }
};

export const UpdateIsReadNotification = async (notificationIds) => {
    try {
        const url = `${baseUrl}/api/Notification/notifications`;
        const request = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            },
            body: JSON.stringify({ notificationIds: notificationIds }), 
        };
        const response = await fetch(url, request);
        return response;
    } catch (err) {
        console.log(err);
    }
};

