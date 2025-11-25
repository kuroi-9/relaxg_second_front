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
    gapless,
    padding,
}: {
    title_name: string;
    percentages: number[] | undefined;
    gapless: boolean;
    padding: number;
}) {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        fetchBooksByTitleName(title_name).then(setBooks);
    }, [title_name]);

    useEffect(() => {
        if (percentages !== undefined) {
            console.log(`${title_name} percentages:`, percentages);
        }
    }, [title_name, percentages]);

    return (
        <div
            className={`titles-books ${
                books.length > 16
                    ? `md:grid md:grid-cols-2 md:w-full flex flex-col items-start ${gapless ? "" : "gap-4"} p-${padding} w-full`
                    : `flex flex-col items-start ${gapless ? "" : "gap-4"} p-${padding} w-full`
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
                        className={`${gapless ? "" : "border"} flex ${percentages ? "justify-between" : "justify-center"} items-center p-2 h-min w-full`}
                        style={
                            !gapless
                                ? {}
                                : {
                                      borderBottom:
                                          "1px solid var(--foreground)",
                                      borderLeft: "1px solid var(--foreground)",
                                      borderRight:
                                          "1px solid var(--foreground)",
                                      borderTop:
                                          index === 0
                                              ? "1px solid var(--foreground)"
                                              : undefined,
                                  }
                        }
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
                                {percentages[index]
                                    ? `${percentages[index]}${" "}%`
                                    : "..."}
                            </div>
                        )}
                    </div>
                ))}
        </div>
    );
}
