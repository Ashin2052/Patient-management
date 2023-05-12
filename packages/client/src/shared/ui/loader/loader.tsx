import {axiosInstance} from "../../api";
import {useEffect, useMemo, useState} from "react";
import './loader.css'
import {createPortal} from "react-dom";

export const useAxiosLoader = () => {
    const [counter, setCounter] = useState(0);
    const interceptors = useMemo(() => {
        const inc = () => setCounter(counter => counter + 1);
        const dec = () => setCounter(counter => counter - 1);

        return ({
            request: config => (inc(), config),
            response: response => (dec(), response),
            error: error => (dec(), Promise.reject(error)),
        });
    }, []); // create the interceptors

    useEffect(() => {
        // add request interceptors
        const reqInterceptor = axiosInstance.interceptors.request.use(interceptors.request, interceptors.error);
        // add response interceptors
        const resInterceptor = axiosInstance.interceptors.response.use(interceptors.response, interceptors.error);
        return () => {
            // remove all intercepts when done
            axiosInstance.interceptors.request.eject(reqInterceptor);
            axiosInstance.interceptors.response.eject(resInterceptor);
        };
    }, [interceptors]);

    return [counter > 0];
};

const portalElement = document.getElementById('loader')!;
export const GlobalLoader = (props) => {
    const [loading] = useAxiosLoader();
    return (
        <>
            {
                loading && createPortal(<div className={'loader'}/>, portalElement)
            }
            <div className={loading ? 'blur' : ''}>
                {props.children}
            </div>
        </>
    );
}