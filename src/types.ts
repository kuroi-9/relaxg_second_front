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
    name: string;
    author: string;
    isbn: string | null;
    title: Title | null;
    filePath: string;
    status: string;
}

export interface Title {
    id: number;
    name: string;
    directory_path: string;
    description: string | null;
    cover_image: string | null;
}

/**
 * Interface for the library context
 */
export interface LibraryContextType {
    books: Book[];
    titles: Title[];
    loading: boolean;
    isLibraryEmpty: boolean;
    refreshCatalog: () => Promise<boolean>;
}

/**
 * Interface for the job_manager context
 */
export interface JobsManagerContextType {
    jobs: Job[];
    loading: boolean;
    startJob: (jobId: number) => Promise<boolean>;
    deleteJob: (jobId: number) => Promise<boolean>;
    stopJob: (jobId: number) => Promise<boolean>;
    fetchJobsProgress: () => Promise<boolean>;
    fetchJobStatus: (jobId: number) => Promise<JobStatus | null>;
}

/**
 * Interface for the job
 */
export interface Job {
    id: number;
    title_name: string;
    description: string | null;
    images_number: number;
    status: string;
    step: string;
    created_at: string;
    completed_at: string | null;
    used_model_name: string;
}

export interface JobStatus {
    status: "Running" | "Stopped";
}
