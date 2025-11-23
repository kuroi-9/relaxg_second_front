import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import type { Book } from "../../types";

async function fetchBooksByTitleName(title_name: string): Promise<Book[]> {
    try {
        const response = await axiosInstance.get(
            `/library/titles/books/${title_name}`,
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching books by title_name:", error);
        throw error;
    }
}

export function TitleBooks({
    title_name,
    percentages,
}: {
    title_name: string;
    percentages: number[] | undefined;
}) {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        fetchBooksByTitleName(title_name).then(setBooks);
    }, [title_name]);

    useEffect(() => {
        if (percentages !== undefined) {
            console.dir(percentages);
        }
    }, [percentages]);

    return (
        <div
            className={`titles-books ${
                books.length > 16
                    ? "md:grid md:grid-cols-2 md:gap-4 md:p-4 md:w-full flex flex-col items-start gap-4 p-4 w-full"
                    : "flex flex-col items-start gap-4 p-4 w-full"
            }`}
        >
            {books.length === 0 && (
                <div className="min-h-16 text-center w-full">Loading...</div>
            )}

            {books
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((book, index) => (
                    <div
                        key={index}
                        className={`border flex ${percentages ? "justify-between" : "justify-center"} items-center p-2 h-min w-full`}
                    >
                        <p
                            className={`${percentages ? "text-left w-5/6" : ""}`}
                        >
                            {book.name}
                        </p>
                        {percentages && (
                            <div
                                style={{
                                    backgroundColor: "#171717",
                                    color: "white",
                                    paddingRight: "0.25rem",
                                    paddingLeft: "0.25rem",
                                    height: "min-content",
                                }}
                            >
                                {percentages[index] ?? "..."}
                            </div>
                        )}
                    </div>
                ))}
        </div>
    );
}
