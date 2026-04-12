import { useState } from "react";

export default function SideBar() {
    const [view, setView] = useState("Training Logs");
    return (
        <div className="fixed top-0 left-0 w-64 h-screen">
            <nav className="flex flex-col justify-start p-4"></nav>
        </div>
    );
}
