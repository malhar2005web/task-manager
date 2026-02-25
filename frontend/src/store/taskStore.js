import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/v1/tasks" : "/api/v1/tasks";
axios.defaults.withCredentials = true;
axios.defaults.withCredentials = true;

export const useTaskStore = create((set, get) => ({
    tasks: [],
    loading: false,
    creating: false,
    pagination: { totalPages: 1, page: 1 },

    fetchTasks: async (filters = {}) => {
        set({ loading: true });
        try {
            const { page = 1, status, priority, search } = filters;
            const params = new URLSearchParams({ page, limit: 10 });
            if (status) params.append('status', status);
            if (priority) params.append('priority', priority);
            if (search) params.append('search', search);

            const response = await axios.get(`${API_URL}?${params.toString()}`);
            set({
                tasks: response.data.tasks || [],
                pagination: response.data.pagination
            });
        } catch (error) {
            console.error("Fetch Tasks Error:", error);
            toast.error("Failed to fetch tasks");
        } finally {
            set({ loading: false });
        }
    },

    createTask: async (taskData) => {
        set({ creating: true });
        try {
            const response = await axios.post(API_URL, taskData);
            if (response.data.success) {
                set((state) => ({
                    tasks: [response.data.task, ...state.tasks],
                    creating: false
                }));
                toast.success("Task created!");
                return true;
            }
        } catch (error) {
            set({ creating: false });
            console.error("Create Task Error:", error);
            const msg = error.response?.data?.message || "Failed to create task";
            toast.error(msg);
            return false;
        } finally {
            set({ creating: false });
        }
    },

    updateTask: async (id, taskData) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, taskData);
            set((state) => ({
                tasks: state.tasks.map(t => t.id === id ? response.data.task : t)
            }));
            toast.success("Task updated!");
        } catch (error) {
            console.error("Update Task Error:", error);
            toast.error("Update failed");
        }
    },

    deleteTask: async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            set((state) => ({
                tasks: state.tasks.filter(t => t.id !== id)
            }));
            toast.success("Task deleted");
        } catch (error) {
            console.error("Delete Task Error:", error);
            toast.error("Delete failed");
        }
    }
}));
