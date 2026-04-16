import SideBar from "@/components/SideBar";
import { GetServerSideProps } from "next";
import connectDB from "@/db/connectDB";
import { User } from "@/db/models/User";
import { Animal } from "@/db/models/Animal";
import AnimalCard from "@/components/AnimalCard";
import Image from "next/image";
import Link from "next/link";

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
    await connectDB();
    const user = await User.findById(userId).lean();
    if (!user) return { redirect: { destination: "/", permanent: false } };

    const animals = await Animal.find({
        owner: userId,
    }).lean();

    const serializedAnimals = animals.map((animal) => ({
        id: animal._id.toString(),
        name: animal.name,
        breed: animal.breed,
        owner: `${user.firstName} ${user.lastName}`,
        hoursTrained: animal.hoursTrained,
        profilePicture: animal.profilePicture,
    }));

    return {
        props: {
            isAdmin: user.admin,
            animals: serializedAnimals,
            name: user.firstName + " " + user.lastName,
        },
    };
};

export default function Animals({
    isAdmin,
    animals,
    name,
}: {
    isAdmin: boolean;
    animals: any[];
    name: string;
}) {
    return (
        <div className="flex flex-row">
            <SideBar isAdmin={isAdmin} name={name} />
            <div className="p-6 w-full">
                <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-300">
                    <p className="text-2xl font-bold">Animals</p>
                    <div className="flex flex-row">
                        <Image
                            src="/images/createNewLogo.png"
                            alt="NewLogo"
                            width={20}
                            height={12}
                            className="pr-2 w-7 h-auto"
                        />
                        <Link
                            href="/create-animal"
                            className="flex gap-1 items-center text-gray-600 hover:text-black"
                        >
                            Create new
                        </Link>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4">
                    {animals.map((animal) => (
                        <AnimalCard
                            key={animal.id}
                            id={animal.id}
                            img={animal.profilePicture}
                            name={animal.name}
                            breed={animal.breed}
                            owner={animal.owner}
                            trained={animal.hoursTrained}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
