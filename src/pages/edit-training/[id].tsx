import { GetServerSideProps } from "next";
import connectDB from "@/db/connectDB";
import { TrainingLog } from "@/db/models/TrainingLog";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params;
    const userId = context.req.cookies.userId;

    if (!userId) return { redirect: { destination: "/", permanent: false } };

    await connectDB();
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
        },
    };
};

export default function EditTraining({ log }) {
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
        <div className="flex flex-col items-center mt-24">
            <p className="mb-8 text-3xl font-bold">Edit Training Log</p>
            <div className="flex flex-col gap-4 w-[500px]">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    className="py-1 bg-transparent border-b-2 focus:outline-none border-[#D21312]"
                />
                <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    className="py-1 bg-transparent border-b-2 focus:outline-none border-[#D21312]"
                />
                <input
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    type="number"
                    placeholder="Hours"
                    className="py-1 bg-transparent border-b-2 focus:outline-none border-[#D21312]"
                />
                <button
                    onClick={handleEdit}
                    className="py-3 font-bold text-white rounded-2xl hover:bg-red-800 bg-[#D21312]"
                >
                    Save
                </button>
                {message && <p className="text-red-500">{message}</p>}
            </div>
        </div>
    );
}
