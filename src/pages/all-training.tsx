import SideBar from "@/components/SideBar";
import { GetServerSideProps } from "next";
import connectDB from "@/db/connectDB";
import { User } from "@/db/models/User";
import { TrainingLog } from "@/db/models/TrainingLog";
import { Animal } from "@/db/models/Animal";

type TrainingLogRow = {
    email: string;
    title: string;
    animal: string;
    hours: number;
    date: string;
};

type AllTrainingProps = {
    isAdmin: boolean;
    trainingLogs: TrainingLogRow[];
    name: string;
};

export default function AllTraining({ isAdmin, trainingLogs, name }: AllTrainingProps) {
    return (
        <div className="flex flex-row">
            <SideBar isAdmin={isAdmin} name={name} />
            <div className="p-3">
                <div className="pt-6 pb-4 pl-4 text-xl font-semibold border-b border-b-gray-500">
                    All Training Logs
                </div>

                <div className="grid grid-cols-5 w-full gap-10 py-3 px-4 font-semibold border-b border-gray-500">
                    <div>User Email</div>
                    <div>Training Title</div>
                    <div>Animal Name</div>
                    <div>Hours Trained</div>
                    <div>Training Date</div>
                </div>

                {trainingLogs.map((log, index) => (
                    <div
                        key={`${log.email}-${log.title}-${index}`}
                        className="grid grid-cols-5 w-full gap-10 py-3 px-4 border-b border-gray-300"
                    >
                        <div>{log.email}</div>
                        <div>{log.title}</div>
                        <div>{log.animal}</div>
                        <div>{log.hours}</div>
                        <div>{log.date}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const userId = context.req.cookies.userId;
    await connectDB();

    const user = await User.findById(userId);
    if (!user) return { redirect: { destination: "/", permanent: false } };

    const logsFromDB = await TrainingLog.find({})
        .populate("user", "email")
        .populate("animal", "name")
        .lean();

    const trainingLogs: TrainingLogRow[] = logsFromDB.map((log: any) => ({
        email: log.user?.email || "Unknown",
        title: log.title || "",
        animal: log.animal?.name || "Unknown",
        hours: log.hours || 0,
        date: log.date ? new Date(log.date).toLocaleDateString("en-US") : "",
    }));

    return {
        props: {
            isAdmin: true,
            trainingLogs,
            name: `${user.firstName} ${user.lastName}`,
        },
    };
};

