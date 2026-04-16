import { useRouter } from "next/router";

export default function TrainingLogCard({
    title,
    date,
    owner,
    animalName,
    breed,
    hours,
    description,
}: {
    title: string;
    date: string;
    owner: string;
    animalName: string;
    breed: string;
    hours: number;
    description: string;
}) {
    const router = useRouter();
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "short" });
    const year = dateObj.getFullYear();

    return (
        <div className="flex flex-row gap-4 items-center p-4 w-full bg-white rounded-xl shadow-sm">
            <div className="flex flex-col justify-center items-center w-20 h-20 text-white rounded-lg bg-[#1B1F6B] shrink-0">
                <p className="text-3xl font-bold">{day}</p>
                <p className="text-xs">
                    {month} - {year}
                </p>
            </div>

            <div className="flex flex-col flex-1">
                <p className="text-lg font-bold">
                    {title}{" "}
                    <span className="font-normal text-gray-500">· {hours} hours</span>
                </p>
                <p className="text-sm text-gray-500">
                    {owner} - {breed} - {animalName}
                </p>
                <p className="mt-1 text-sm">{description}</p>
            </div>

            <button
                onClick={() => router.push(`/edit-training/${id}`)}
                className="flex justify-center items-center w-10 h-10 rounded-full hover:bg-red-800 bg-[#D21312] shrink-0"
            >
                <span className="text-lg text-white">✎</span>
            </button>
        </div>
    );
}
