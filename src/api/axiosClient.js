import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://api.realworld.io/",
});

axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            return response.data;
        }
        return response;
    },
    (error) => {
        throw error;
    }
);

export default axiosClient;
