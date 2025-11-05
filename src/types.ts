/**
 * Interface for user information.
 * Adapt this according to the data that your Django backend returns.
 */
export interface User {
    id: number;
    username: string;
    email: string;
    // Add other fields if your API returns them (e.g., firstName, lastName)
}

/**
 * Interface for the authentication context.
 * Defines what is exposed by `useAuth`.
 */
export interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

export interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string | null;
    series: Bookserie | null;
    filePath: string;
    status: string;
}

export interface Bookserie {
    id: number;
    title: string;
    directory_path: string;
    description: string | null;
    cover_image: string | null;
}

/**
 * Interface for the library context
 */
export interface LibraryContextType {
    books: Book[];
    bookseries: Bookserie[];
    loading: boolean;
    isLibraryEmpty: boolean;
}

/**
 * Interface for the job_manager context
 */
export interface JobsManagerContextType {
    jobs: Job[];
    loading: boolean;
}

/**
 * Interface for the job
 */
export interface Job {
    id: number;
    title: string;
    description: string | null;
    status: string;
    created_at: string;
}
