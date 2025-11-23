import axios from "../api/axios";
import type { Job } from "../types";

const JobsManagerService = {
    // async createJob(title: string, description: string): Promise<Job | null> {
    //     try {
    //         const response = await axios.post("/jobs", { title, description });
    //         return response.data;
    //     } catch (error) {
    //         console.error("Error creating job:", error);
    //         return null;
    //     }
    // },

    /**
     * Fetches all jobs from the server.
     * @returns A promise that resolves to an array of jobs or null if an error occurs.
     */
    async getJobs(): Promise<Job[] | null> {
        try {
            const response = await axios.get("/jobs/all/");
            return response.data;
        } catch (error) {
            console.error("Error fetching jobs:", error);
            return null;
        }
    },

    async getJobsProgress(): Promise<boolean> {
        try {
            const response = await axios.get("/jobs/progress/");
            return response.data === 200;
        } catch (error) {
            console.error("Error fetching jobs progress:", error);
            return false;
        }
    },

    /**
     * Starts a job with the given ID.
     * @param id The ID of the job to start.
     * @returns A promise that resolves to the updated job or null if an error occurs.
     */
    async startJob(jobId: number): Promise<Job | null> {
        try {
            const response = await axios.post("/jobs/inference/", {
                id: jobId,
            });
            return response.data;
        } catch (error) {
            console.error("Error starting job:", error);
            return null;
        }
    },

    // async getJobById(id: string): Promise<Job | null> {
    //     try {
    //         const response = await axios.get(`/jobs/${id}`);
    //         return response.data;
    //     } catch (error) {
    //         console.error("Error fetching job:", error);
    //         return null;
    //     }
    // },

    // async updateJob(
    //     id: string,
    //     title: string,
    //     description: string,
    // ): Promise<Job | null> {
    //     try {
    //         const response = await axios.put(`/jobs/${id}`, {
    //             title,
    //             description,
    //         });
    //         return response.data;
    //     } catch (error) {
    //         console.error("Error updating job:", error);
    //         return null;
    //     }
    // },

    async stopJob(jobId: number): Promise<boolean> {
        try {
            const response = await axios.post(`/jobs/stop/${jobId}`);
            return response.status === 200;
        } catch (error) {
            console.error("Error stopping job:", error);
            return false;
        }
    },

    async deleteJob(id: number): Promise<boolean> {
        try {
            await axios.delete(`/jobs/delete/${id}`);
            return true;
        } catch (error) {
            console.error("Error deleting job:", error);
            return false;
        }
    },
};

export default JobsManagerService;
