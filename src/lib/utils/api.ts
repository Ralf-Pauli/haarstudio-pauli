import { PUBLIC_API_TOKEN, PUBLIC_STRAPI_HOST } from "$env/static/public";

export async function strapiFetch(
  fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>,
  url: String,
): Promise<any> {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${PUBLIC_API_TOKEN}`);

  try {
    // Fetch data
    const response = await fetch(`${PUBLIC_STRAPI_HOST}/${url}`, {
      method: "GET",
      headers,
    });

    // Check if response is ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse JSON response
    return await response.json();
  } catch (error) {
    // Log and re-throw the error
    console.error(error);
    throw error instanceof Error ? error : new Error("Invalid JSON response");
  }
}