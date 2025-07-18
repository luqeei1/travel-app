export const Visited = async (): Promise<string[]> => {
    const response = await fetch("http://localhost:8000/travel/previous", {
        method: "GET",
    });

    const data = await response.text(); // temporarily use .text()

    if (!response.ok) {
        console.error("Error response:", response.status, data); // 👈 log details
        throw new Error("Failed to fetch");
    } else {
        console.log("fetched visited destinations:", data);
    }

    return JSON.parse(data) as string[]; // manually parse
};
