import axios from "../api/axios";
import type { Book, Bookserie } from "../types"; // Importe tes types

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
     * Fetches every bookseries available in the library.
     * @returns An array of bookseries or null if an error occurs.
     */
    async getBookseries(): Promise<Bookserie[] | null> {
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
