import { type Bookserie, type Book } from "../types"; // Importe tes types
import axios from "../api/axios";

const LibraryService = {
    /**
     * Every single book in the library is returned.
     * @returns
     */
    async getBooks(): Promise<Book[]> {
        try {
            const response = await axios.get("/library/books/");
            return response.data;
        } catch (error) {
            console.error("Error fetching every single book:", error);
            throw error;
        }
    },

    /**
     * Fetches every bookseries available in the library.
     * @returns
     */
    async getBookseries(): Promise<Bookserie[]> {
        try {
            const response = await axios.get("/library/bookseries/");
            return response.data.bookseries;
        } catch (error) {
            console.error("Error fetching bookseries:", error);
            throw error;
        }
    },
};

export default LibraryService;
