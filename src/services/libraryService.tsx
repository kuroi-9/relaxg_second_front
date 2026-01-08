import axios from "../api/axios";
import type { Book, Title } from "../types"; // Importe tes types

const LibraryService = {
    async createJob(titleId: number): Promise<boolean> {
        try {
            const response = await axios.post("/library/process/", {
                title_id: titleId,
            });
            console.warn(
                `Job for title with ID ${titleId} created successfully!`,
            );
            return response.status === 200;
        } catch (error) {
            console.warn(
                `Failed to create job for title with ID ${titleId}`,
                error,
            );
            return false;
        }
    },

    /**
     * Every single book in the library is returned.
     * @returns An array of books or null if an error occurs.
     */
    async getBooks(): Promise<Book[] | null> {
        try {
            const response = await axios.get("/library/books/");
            return response.data;
        } catch (error) {
            console.error("Error fetching every single book:", error);
            throw error;
        }
    },

    /**
     * Fetches every titles available in the library.
     * @returns An array of titles or null if an error occurs.
     */
    async getTitles(): Promise<Title[] | null> {
        try {
            const response = await axios.get("/library/titles/");
            return response.data.titles;
        } catch (error) {
            console.error("Error fetching titles:", error);
            throw error;
        }
    },

    async refreshCatalog(): Promise<boolean> {
        try {
            await axios.post("/library/refresh/");
            return true;
        } catch (error) {
            console.error("Error refreshing catalog:", error);
            throw error;
        }
    },
};

export default LibraryService;
