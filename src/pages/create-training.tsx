import SideBar from "@/components/SideBar";
import { GetServerSideProps } from "next";
import connectDB from "@/db/connectDB";
import { User } from "@/db/models/User";
import { useState } from "react";
import { useRouter } from "next/router";
import { Animal } from "@/db/models/Animal";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const userId = context.req.cookies.userId;
    if (!userId) return { redirect: { destination: "/", permanent: false } };

    await connectDB();
    const user = await User.findById(userId).lean();
    if (!user) return { redirect: { destination: "/", permanent: false } };

    const animals = await Animal.find({ owner: userId }).lean();
    const serializedAnimals = animals.map((animal) => ({
        id: animal._id.toString(),
        name: animal.name,
        breed: animal.breed,
    }));

    return {
        props: {
            isAdmin: user.admin ?? false,
            userId,
            name: user.firstName + " " + user.lastName,
            animals: serializedAnimals,
        },
    };
};
export default function CreateTraining({
    isAdmin,
    userId,
    name,
    animals,
}: {
    isAdmin: boolean;
    userId: string;
    name: string;
    animals: { id: string; name: string; breed: string }[];
}) {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [animal, setAnimal] = useState("");
    const [hours, setHours] = useState("");
    const [month, setMonth] = useState("");
    const [date, setDate] = useState("");
    const [year, setYear] = useState("");
    const [message, setMessage] = useState("");
    const [note, setNote] = useState("");

    async function Submit() {
        if (!title) return setMessage("Title required");
        if (!animal) return setMessage("Animal required");
        if (!hours) return setMessage("Total hours required");
        if (!month) return setMessage("Month required");
        if (!date) return setMessage("Date required");
        if (!year) return setMessage("Year required");
        if (!note) return setMessage("Note required");

        const res = await fetch("/api/training", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId,
                animal,
                title,

                hours: Number(hours),
            }),
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
                <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-300">
                    <p className="text-2xl font-bold">Training Logs</p>
                </div>
                <div className="flex flex-col gap-6 items-center w-full">
                    <div className="flex flex-col gap-1 w-full max-w-[873px]">
                        <label className="font-bold">Title</label>
                        <input
                            className="p-3 w-full bg-transparent rounded-sm border-gray-200 focus:outline-none border-[2.5px]"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1 w-full max-w-[873px]">
                        <label className="font-bold">Select Animal</label>
                        <select
                            className="p-3 w-full bg-transparent rounded-sm border-gray-200 focus:outline-none border-[2.5px]"
                            value={animal}
                            onChange={(e) => setAnimal(e.target.value)}
                        >
                            <option value="">Select Animal</option>
                            {animals.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.name} - {a.breed}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1 w-full max-w-[873px]">
                        <label className="font-bold">Total hours trained</label>
                        <input
                            className="p-3 w-full bg-transparent rounded-sm border-gray-200 focus:outline-none border-[2.5px]"
                            placeholder="Hours"
                            type="number"
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1 w-full max-w-[873px]">
                        <label className="font-bold">Date</label>
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
                                placeholder="Day"
                                type="number"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                            <input
                                className="flex-1 p-3 bg-transparent rounded-sm border-gray-200 focus:outline-none border-[2.5px]"
                                placeholder="Year"
                                type="number"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                            />
                        </div>
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
                            onClick={() => router.push("/training-logs")}
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
