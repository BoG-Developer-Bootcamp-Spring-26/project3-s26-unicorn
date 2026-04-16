import SideBar from "@/components/SideBar";
import { GetServerSideProps } from "next";
import connectDB from "@/db/connectDB";
import { User } from "@/db/models/User";
import { useState } from "react";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const userId = context.req.cookies.userId;
    if (!userId) return { redirect: { destination: "/", permanent: false } };
    await connectDB();
    const user = await User.findById(userId).lean();
    if (!user) return { redirect: { destination: "/", permanent: false } };
    return {
        props: {
            isAdmin: user.admin ?? false,
            userId,
            userName: user.firstName + " " + user.lastName,
        },
    };
};

export default function CreateAnimal({
    isAdmin,
    userId,
    userName,
}: {
    isAdmin: boolean;
    userId: string;
    userName: string;
}) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [breed, setBreed] = useState("");
    const [hours, setHours] = useState("");
    const [month, setMonth] = useState("");
    const [date, setDate] = useState("");
    const [year, setYear] = useState("");
    const [note, setNote] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [message, setMessage] = useState("");

    async function Submit() {
        if (!name) return setMessage("Name required");
        if (!breed) return setMessage("Breed required");
        if (!hours) return setMessage("Total hours required");
        if (!month) return setMessage("Month required");
        if (!date) return setMessage("Date required");
        if (!year) return setMessage("Year required");

        const res = await fetch("/api/animal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                breed,
                owner: userId,
                hoursTrained: Number(hours),
                profilePicture: profilePicture || "/images/defaultAnimal.png",
            }),
        });

        if (res.ok) {
            router.push("/animals");
        } else {
            const data = await res.json();
            setMessage(data.message);
        }
    }

    return (
        <div className="flex flex-row">
            <SideBar isAdmin={isAdmin} name={userName} />
            <div className="p-6 ml-64 w-full">
                <div className="flex items-center pb-4 mb-6 border-b border-gray-300">
                    <p className="text-2xl font-bold">Animals</p>
                </div>
                <div className="flex flex-col gap-6 items-center w-full">
                    <div className="flex flex-col gap-1 w-full max-w-[873px]">
                        <label className="font-bold">Animal Name</label>
                        <input
                            className="p-3 w-full bg-transparent rounded-sm border-gray-200 focus:outline-none border-[2.5px]"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1 w-full max-w-[873px]">
                        <label className="font-bold">Breed</label>
                        <input
                            className="p-3 w-full bg-transparent rounded-sm border-gray-200 focus:outline-none border-[2.5px]"
                            placeholder="Breed"
                            value={breed}
                            onChange={(e) => setBreed(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1 w-full max-w-[873px]">
                        <label className="font-bold">Total hours trained</label>
                        <input
                            className="p-3 w-full bg-transparent rounded-sm border-gray-200 focus:outline-none border-[2.5px]"
                            placeholder="100"
                            type="number"
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1 w-full max-w-[873px]">
                        <label className="font-bold">Birth Month</label>
                        <div className="flex gap-4">
                            <select
                                className="flex-1 p-3 bg-transparent rounded-sm border-gray-200 focus:outline-none border-[2.5px]"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                            >
                                <option value="">Month</option>
                                {[
                                    "January",
                                    "February",
                                    "March",
                                    "April",
                                    "May",
                                    "June",
                                    "July",
                                    "August",
                                    "September",
                                    "October",
                                    "November",
                                    "December",
                                ].map((m) => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))}
                            </select>
                            <input
                                className="p-3 w-24 bg-transparent rounded-sm border-gray-200 focus:outline-none border-[2.5px]"
                                placeholder="20"
                                type="number"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                            <input
                                className="flex-1 p-3 bg-transparent rounded-sm border-gray-200 focus:outline-none border-[2.5px]"
                                placeholder="2023"
                                type="number"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 w-full max-w-[873px]">
                        <label className="font-bold">Profile Picture URL</label>
                        <input
                            className="p-3 w-full bg-transparent rounded-sm border-gray-200 focus:outline-none border-[2.5px]"
                            placeholder="https://..."
                            value={profilePicture}
                            onChange={(e) => setProfilePicture(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1 w-full max-w-[873px]">
                        <label className="font-bold">Note</label>
                        <textarea
                            className="p-3 w-full h-36 bg-transparent rounded-sm border-gray-200 resize-none focus:outline-none border-[2.5px]"
                            placeholder="Note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-4 w-full max-w-[873px]">
                        <button
                            className="py-3 px-8 font-bold rounded-2xl border-2 hover:bg-red-50 text-[#D21312] border-[#D21312]"
                            onClick={() => router.push("/animals")}
                        >
                            Cancel
                        </button>
                        <button
                            className="py-3 px-8 font-bold text-white rounded-2xl hover:bg-red-800 bg-[#D21312]"
                            onClick={Submit}
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
