import {Navigate} from 'react-router-dom';
import {useAppSelector} from "./hooks/redux.hooks";

export const PrivateRoute = ({children}: any) => {
    const authState = useAppSelector((state) => state.authSlice);
    if (!authState.isLoggedIn) {
        // not logged in so redirect to login page with the return url
        return <Navigate to="/login"/>
    }
    // authorized so return child components
    return children;
}