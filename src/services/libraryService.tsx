import axios from "../api/axios";
import type { Book, Title } from "../types"; // Importe tes types

const LibraryService = {
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
