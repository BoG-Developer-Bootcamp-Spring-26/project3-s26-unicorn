import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import SideBar from "@/components/SideBar";
import { useState } from "react";

export default function Dashboard() {
    const [view, setView] = useState("Training Logs");
    return (
        <div>
            <SideBar />
            <div className="pt-6 border-b border-b-gray-500">{view}</div>
        </div>
    );
}
