import axios, {AxiosHeaders} from 'axios';

const axiosInstance = axios.create();
const baseUrl = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

export const callApi = (data: IAxios, multipart = false) => {
    axiosInstance.defaults.headers['Content-Type'] = multipart
        ? `multipart/form-data` : "application/json"

    const url = `${baseUrl}/api/${data.url}/${data.reqParams ? data.reqParams : ''}`
        .replace(/\/$/, '');

    return axiosInstance({
        data: data.payload,
        method: data.method,
        url,
    });
};

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            if (config.headers instanceof AxiosHeaders) {
                config.headers.set('x-access-token', accessToken);
            }
        }
        return config;
    },
    (error) => {
        Promise.reject(error).catch();
    }
);

//response interceptor to refresh token on receiving token expired error
axiosInstance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    function (error) {
        const invalidStatus = error.response.status === 401 || error.response.status === 403;
        const originalRequest = error.config;
        let refreshToken = localStorage.getItem("refreshToken");
        if (
            refreshToken &&
            invalidStatus &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            return callApi({
                method: "post",
                url: 'user/refresh_token',
                payload: {refreshToken}
            }).then((res: any) => {
                localStorage.setItem("accessToken", res.accessToken);
                return axiosInstance(originalRequest);
            }).catch(() => {
                window.location.href = '/login';
            })
        }
        if (invalidStatus) {
            window.location.href = '/login';
        }
        return Promise.reject(error.response);
    }
);
export {axiosInstance};

export interface IAxios {
    method: 'get' | 'post' | 'put' | 'delete',
    payload?: any,
    url: string;
    reqParams?: string
}

export default callApi;