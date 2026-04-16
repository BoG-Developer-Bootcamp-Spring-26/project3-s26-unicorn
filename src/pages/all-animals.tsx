import SideBar from "@/components/SideBar";
import { GetServerSideProps } from "next";
import connectDB from "@/db/connectDB";
import { User } from "@/db/models/User";
import { Animal } from "@/db/models/Animal";

type AnimalRow = {
    name: string;
    breed: string;
    owner: string;
    hoursTrained: number;
};

type AllAnimalsProps = {
    isAdmin: boolean;
    animals: AnimalRow[];
    name: string;
};

export default function AllAnimals({
    isAdmin,
    animals,
    name,
}: AllAnimalsProps) {
    return (
        <div className="flex flex-row">
            <SideBar isAdmin={isAdmin} name={name} />
            <div className="p-3">
                <div className="pt-6 pb-4 pl-4 text-xl font-semibold border-b border-b-gray-500">
                    All Animals
                </div>

                <div className="grid grid-cols-4 gap-4 py-3 px-4 font-semibold border-b border-gray-500">
                    <div>Name</div>
                    <div>Breed</div>
                    <div>Owner</div>
                    <div>Hours Trained</div>
                </div>

                {animals.map((animal, index) => (
                    <div
                        key={`${animal.name}-${animal.owner}-${index}`}
                        className="grid grid-cols-4 gap-4 py-3 px-4 border-b border-gray-300"
                    >
                        {" "}
                        <div>{animal.name}</div>
                        <div>{animal.breed}</div>
                        <div>{animal.owner}</div>
                        <div>{animal.hoursTrained}</div>
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

    const animalsFromDB = await Animal.find({}).lean();

    const ownerIds = [
        ...new Set(animalsFromDB.map((animal: any) => animal.owner?.toString()).filter(Boolean)),
    ];
    const ownersFromDB = await User.find(
        { _id: { $in: ownerIds } },
        "firstName lastName",
    ).lean();
    const ownersById = new Map(
        ownersFromDB.map((owner: any) => [
            owner._id.toString(),
            `${owner.firstName || ""} ${owner.lastName || ""}`.trim() || "Unknown",
        ]),
    );

    const animals: AnimalRow[] = animalsFromDB.map((animal: any) => ({
        name: animal.name || "",
        breed: animal.breed || "",
        owner: ownersById.get(animal.owner?.toString()) || "Unknown",
        hoursTrained: animal.hoursTrained || 0,
    }));

    return {
        props: {
            isAdmin: true,
            animals,
            name: user.firstName + " " + user.lastName,
        },
    };
};
