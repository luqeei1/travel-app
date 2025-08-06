export const Visited = async (): Promise<[string, string][]> => {
    const response = await fetch("http://localhost:8000/travel/previous", {
        method: "GET",
    });

    const data = await response.text(); 

    if (!response.ok) {
        console.error("Error response:", response.status, data);
        throw new Error("Failed to fetch");
    } else {
        console.log("fetched visited destinations:", data);
    }

    return JSON.parse(data) as [string, string][];
};

export const DeleteVisited = async (name: string): Promise<void> => {
    const response = await fetch(`http://localhost:8000/travel/previous/${name}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorData = await response.text();
        console.error("Error response:", response.status, errorData);
        throw new Error("Failed to delete visited destination");
    }
    console.log("Deleted visited destination:", name);
}

export const Journal = async (name: string): Promise<string> => {
    const response = await fetch(`http://localhost:8000/travel/local-journal/${name}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!response.ok) {
        const errorData = await response.text();
        console.error("Error response:", response.status, errorData);
        throw new Error("Failed to fetch journal entries");
    }

    const data = await response.json() as string;
    console.log("Fetched journal entry:", data);
    return data;
}

export const UpdateJournal = async (name: string, journal: string): Promise<void> => {
    const response = await fetch(`http://localhost:8000/travel/update_journal`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, journal }),
    });

    if (!response.ok) {
        const errorData = await response.text();
        console.error("Error response:", response.status, errorData);
        throw new Error("Failed to update journal entry");
    }

    console.log("Journal entry updated successfully");
}