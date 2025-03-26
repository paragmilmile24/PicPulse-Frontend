import axios from "axios";
import {
    getItem,
    KEY_ACCESS_TOKEN,
    removeItem,
    setItem,
} from "./localStorageManager";

import store from "../redux/store"; //To use dispatch in normal files (non-components)
import { showToast } from "../redux/slices/appConfigSlice";
import { TOAST_FAILURE } from "../App";

export const axiosClient = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER_BASE_URL}`,
    withCredentials: true,
});

axiosClient.interceptors.request.use((request) => {
    const accessToken = getItem(KEY_ACCESS_TOKEN);
    // console.log("In Interceptor , access Token : ", accessToken);
    request.headers["Authorization"] = `Bearer ${accessToken}`;

    return request;
});

axiosClient.interceptors.response.use(
    async (response) => {
        const data = response.data;

        if (data.status === "ok") {
            return data;
        }

        const originalRequest = response.config;
        const statusCode = data.statusCode;
        const error = data.message;

        // if (
        //     statusCode === 401 &&
        //     originalRequest.url ===
        //         `${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`
        // ) {
        //     removeItem(KEY_ACCESS_TOKEN);
        //     window.location.replace("/login", "_self");
        //     return Promise.reject(error);
        // }

        store.dispatch(
            showToast({
                type: TOAST_FAILURE,
                message: error,
            })
        );

        if (statusCode === 401) {
            const response = await axios
                .create({ withCredentials: true })
                .get(`${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`);

            console.log("Response for Refresh request : ", response);

            if (response.data.status === "ok") {
                setItem(KEY_ACCESS_TOKEN, response.data.result.accessToken);
                originalRequest.headers[
                    "Authorization"
                ] = `Bearer ${response.result.accessToken}`;

                return axios(originalRequest);
            } else {
                removeItem(KEY_ACCESS_TOKEN);
                window.location.replace("/login", "_self");
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    },
    async (error) => {
        store.dispatch(
            showToast({
                type: TOAST_FAILURE,
                message: error.message,
            })
        );
    }
);
