import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router-dom";
import Home from "../page";
import CreateAccount from "./pages/create-account";

function App() {
    return (
        <StrictMode>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/create-account" element={<CreateAccount />} />
                </Routes>
            </BrowserRouter>
        </StrictMode>
    );
}
