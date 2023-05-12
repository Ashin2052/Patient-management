import React from 'react';
import './App.css';
import AppRoutes from "./routes";
import {BrowserRouter} from "react-router-dom";
import {GlobalLoader} from "./shared/ui/loader/loader";

function App() {
    return (
        <BrowserRouter>
            <GlobalLoader>
                <div className="app-container">
                    <AppRoutes/>
                </div>
            </GlobalLoader>
        </BrowserRouter>
    );
}

export default App;
