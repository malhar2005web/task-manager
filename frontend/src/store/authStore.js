import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/v1/auth" : `${window.location.origin}/api/v1/auth`;
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,

    signup: async (credentials) => {
        set({ isSigningUp: true });
        try {
            const response = await axios.post(`${API_URL}/signup`, credentials);
            set({ user: response.data.user });
            toast.success("Account created successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed");
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (credentials) => {
        set({ isLoggingIn: true });
        try {
            const response = await axios.post(`${API_URL}/login`, credentials);
            set({ user: response.data.user });
            toast.success("Logged in successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axios.post(`${API_URL}/logout`);
            set({ user: null });
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error("Logout failed");
        }
    },

    authCheck: async () => {
        set({ isCheckingAuth: true });
        try {
            const response = await axios.get(`${API_URL}/authCheck`);
            set({ user: response.data.user });
        } catch (error) {
            set({ user: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },
}));
