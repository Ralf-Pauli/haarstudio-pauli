import { PUBLIC_STRAPI_HOST, PUBLIC_API_TOKEN } from "$env/static/public";

interface ResponseData {
    [key: string]: any;
}

export const strapiFetch = async (url: string): Promise<any> => {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${PUBLIC_API_TOKEN}`);
    let response;
    try {
        response = await fetch(`${PUBLIC_STRAPI_HOST}/${url}`, {
            method: "GET",
            headers: headers
        });
    } catch (error) {
        console.error(error);
        throw new Error("Network error");
    }

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    // If response is successful, convert it to JSON format
    let responseData: ResponseData;
    try {
        responseData = await response.json();
    } catch (error) {
        // Handle JSON parsing error
        console.error(error);
        throw new Error("Invalid JSON response");
    }

    return responseData;
};