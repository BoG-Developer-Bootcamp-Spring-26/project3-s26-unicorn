import SearchBar from "@/components/SearchBar";
import SideBar from "@/components/SideBar";
import { useState } from "react";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const userId = context.req.cookies.userId;
    if (!userId) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
    return { props: {} };
};

export default function Dashboard() {
    const [view, setView] = useState("Training Logs");
    return (
        <div>
            <SideBar />
            <div className="pt-6 border-b border-b-gray-500">{view}</div>
        </div>
    );
}
