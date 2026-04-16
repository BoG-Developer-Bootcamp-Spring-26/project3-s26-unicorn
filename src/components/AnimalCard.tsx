import Image from "next/image";
import Avatar from "./Avatar";

export default function AnimalCard({
    img,
    name,
    breed,
    trained,
    owner,
}: {
    img: string;
    name: string;
    breed: string;
    trained: number;
    owner: string;
    id: string;
}) {
    return (
        <div className="flex flex-col rounded-2xl shadow shadow-black">
            <Image
                src={img}
                alt="animal"
                height={374}
                width={400}
                className="w-full h-auto"
            />
            <div className="flex flex-row">
                <Avatar name={name} />
                <div className="flex flex-col">
                    <p className="text-lg font-bold">
                        {name} - {breed}
                    </p>
                    <p className="text-sm text-gray-500">
                        {owner} trained: {trained} hours
                    </p>
                </div>
            </div>
        </div>
    );
}
