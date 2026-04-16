import { GetServerSideProps } from "next";
import connectDB from "@/db/connectDB";
import { TrainingLog } from "@/db/models/TrainingLog";
import { User } from "@/db/models/User";
import { useRouter } from "next/router";
import { useState } from "react";
import SideBar from "@/components/SideBar";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params as { id: string };
    const userId = context.req.cookies.userId;
    if (!userId) return { redirect: { destination: "/", permanent: false } };
    await connectDB();
    const user = await User.findById(userId).lean();
    if (!user) return { redirect: { destination: "/", permanent: false } };
    const log = await TrainingLog.findById(id).lean();

    if (!log) return { notFound: true };

    return {
        props: {
            log: {
                id: log._id.toString(),
                title: log.title,
                description: log.description,
                hours: log.hours,
                animalId: log.animal.toString(),
            },
            name: user.firstName + " " + user.lastName,
        },
    };
};

export default function EditTraining({
    log,
    isAdmin,
    userName,
}: {
    log: {
        id: string;
        title: string;
        description: string;
        hours: number;
        animalId: string;
    };
    isAdmin: boolean;
    userName: string;
}) {
    const router = useRouter();
    const [title, setTitle] = useState(log.title);
    const [description, setDescription] = useState(log.description);
    const [hours, setHours] = useState(log.hours);
    const [message, setMessage] = useState("");

    async function handleEdit() {
        const res = await fetch("/api/training", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: log.id, title, description, hours }),
        });
        if (res.ok) {
            router.push("/training-logs");
        } else {
            const data = await res.json();
            setMessage(data.message);
        }
    }

    return (
        <div className="flex flex-row">
            <SideBar isAdmin={isAdmin} name={name} />
            <div className="p-6 w-full">
                <div className="flex items-center pb-4 mb-6 border-b border-gray-300">
                    <p className="text-2xl font-bold">Edit Training Log</p>
                </div>
                <div className="flex flex-col gap-6 items-center w-full">
                    <div className="flex flex-col gap-1 w-full max-w-[873px]">
                        <label className="font-bold">Title</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title"
                            className="p-3 w-full bg-transparent rounded-sm border-gray-200 focus:outline-none border-[2.5px]"
                        />
                    </div>
                    <div className="flex flex-col gap-1 w-full max-w-[873px]">
                        <label className="font-bold">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                            className="p-3 w-full h-36 bg-transparent rounded-sm border-gray-200 resize-none focus:outline-none border-[2.5px]"
                        />
                    </div>
                    <div className="flex flex-col gap-1 w-full max-w-[873px]">
                        <label className="font-bold">Hours</label>
                        <input
                            value={hours}
                            onChange={(e) => setHours(Number(e.target.value))}
                            type="number"
                            placeholder="Hours"
                            className="p-3 w-full bg-transparent rounded-sm border-gray-200 focus:outline-none border-[2.5px]"
                        />
                    </div>
                    <div className="flex gap-4 w-full max-w-[873px]">
                        <button
                            onClick={() => router.push("/training-logs")}
                            className="py-3 px-8 font-bold rounded-2xl border-2 hover:bg-red-50 text-[#D21312] border-[#D21312]"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleEdit}
                            className="py-3 px-8 font-bold text-white rounded-2xl hover:bg-red-800 bg-[#D21312]"
                        >
                            Save
                        </button>
                    </div>
                    {message && <p className="text-red-500">{message}</p>}
                </div>
            </div>
        </div>
    );
}
