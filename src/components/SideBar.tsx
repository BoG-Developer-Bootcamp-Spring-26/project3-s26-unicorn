import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function SideBar() {
    const router = useRouter();
    const links = [
        { label: "Training Logs", href: "/training-logs" },
        { label: "Animals", href: "/animals" },
        { label: "All training", href: "/all-training", adminOnly: true },
        { label: "All animals", href: "/all-animals" },
        { label: "All users", href: "/all-users" },
    ];

    return (
        <div className="fixed top-0 left-0 w-64 h-screen">
            <nav className="flex flex-col justify-start p-4">
                <div className="flex items-center p-3 w-full leading-tight rounded-lg transition-all outline-none hover:text-blue-gray-900 hover:bg-blue-gray-50 hover:bg-opacity-80 focus:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 active:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 text-start">
                    <button />
                    <button />
                    <button />
                    <button />
                </div>
            </nav>
        </div>
    );
}
