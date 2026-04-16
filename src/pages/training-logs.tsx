import SideBar from "@/components/SideBar";
import { GetServerSideProps } from "next";
import connectDB from "@/db/connectDB";
import { User } from "@/db/models/User";
import { TrainingLog } from "@/db/models/TrainingLog";
import { Animal } from "@/db/models/Animal";
import TrainingLogCard from "@/components/TrainingLogCard";
import Link from "next/link";
import Image from "next/image";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const userId = context.req.cookies.userId;
    if (!userId) return { redirect: { destination: "/", permanent: false } };

    await connectDB();
    const user = await User.findById(userId).lean();
    if (!user) return { redirect: { destination: "/", permanent: false } };

    const logs = await TrainingLog.find({ user: userId })
        .sort({ date: -1 })
        .lean();

    const logsWithDetails = await Promise.all(
        logs.map(async (log) => {
            const animal = await Animal.findById(log.animal).lean();
            return {
                id: log._id.toString(),
                title: log.title,
                date: log.date.toString(),
                owner: `${user.firstName} ${user.lastName}`,
                animalName: animal?.name,
                breed: animal?.breed,
                hours: log.hours,
                description: log.description,
            };
        }),
    );

    return {
        props: {
            isAdmin: user.admin,
            logs: logsWithDetails,
            name: user.firstName + " " + user.lastName,
        },
    };
};

export default function TrainingLogs({
    isAdmin,
    logs,
    name,
}: {
    isAdmin: boolean;
    logs: any[];
    name: string;
}) {
    return (
        <div className="flex">
            <SideBar isAdmin={isAdmin} name={name} />
            <div className="p-6 w-full">
                <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-300">
                    <p className="text-2xl font-bold">Training Logs</p>
                    <div className="flex flex-row">
                        <Image
                            src="/images/createNewLogo.png"
                            alt="NewLogo"
                            width={20}
                            height={12}
                            className="pr-2 w-7 h-auto"
                        />
                        <Link
                            href="/create-training"
                            className="flex gap-1 items-center text-gray-600 hover:text-black"
                        >
                            Create new
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    {logs.map((log) => (
                        <TrainingLogCard key={log.id} {...log} />
                    ))}
                </div>
            </div>
        </div>
    );
}
