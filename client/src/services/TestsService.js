import axios from '../api/axios';

const TestsService = {
    getAllCategories: async () => {
        const response = await axios.get('/api/categories');
        return response.data;
    },

    createCategory: async (data) => {
        const response = await axios.post('/api/categories', data);
        return response.data;
    },

    updateCategory: async (id, data) => {
        const response = await axios.put(`/api/categories/${id}`, data);
        return response.data;
    },

    deleteCategory: async (id) => {
        const response = await axios.delete(`/api/categories/${id}`);
        return response.data;
    },

    getPanels: async (categoryId) => {
        const response = await axios.get(`/api/tests?categoryId=${categoryId}`);
        return response.data;
    },

    createPanel: async (data) => {
        const response = await axios.post('/api/tests', data);
        return response.data;
    },

    updatePanel: async (id, data) => {
        const response = await axios.put(`/api/tests/${id}`, data);
        return response.data;
    },

    deletePanel: async (id) => {
        const response = await axios.delete(`/api/tests/${id}`);
        return response.data;
    },

    createParameter: async (data) => {
        const response = await axios.post('/api/parameters', data);
        return response.data;
    },

    updateParameter: async (id, data) => {
        const response = await axios.put(`/api/parameters/${id}`, data);
        return response.data;
    },

    deleteParameter: async (id) => {
        const response = await axios.delete(`/api/parameters/${id}`);
        return response.data;
    },
};

export default TestsService;
