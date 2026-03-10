import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        accessToken: localStorage.getItem('access_token') || null,
        loading: false,
        error: null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.accessToken,
    },

    actions: {
        async login(credentials) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.post('/auth/login', credentials); // Mapping old process.env.NEURONA_AUTH_ENDPOINT
                const token = response.data.access_token;
                this.accessToken = token;
                localStorage.setItem('access_token', token);

                // After login, we optionally fetch user data
                // await this.fetchUser();

                return response;
            } catch (err) {
                this.error = err.response?.data?.message || err.message || 'Error occurred during login.';
                this.accessToken = null;
                localStorage.removeItem('access_token');
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async fetchUser() {
            try {
                const response = await api.post('/auth/me'); // Mapping NEURONA_USER_ENDPOINT
                this.user = response.data;
                return response.data;
            } catch (err) {
                this.user = null;
                throw err;
            }
        },

        async logout() {
            try {
                await api.post('/auth/logout'); // Mapping NEURONA_LOGOUT_ENDPOINT
            } catch (err) {
                console.error('Logout error:', err);
            } finally {
                this.user = null;
                this.accessToken = null;
                localStorage.removeItem('access_token');
            }
        }
    }
});
