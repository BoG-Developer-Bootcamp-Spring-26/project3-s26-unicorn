import SideBar from "@/components/SideBar";
import { GetServerSideProps } from "next";
import connectDB from "@/db/connectDB";
import { User } from "@/db/models/User";

type UserRow = {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    admin: boolean;
};

type AllUsersProps = {
    isAdmin: boolean;
    users: UserRow[];
    name: string;
};

export default function AllUsers({ isAdmin, users, name }: AllUsersProps) {
    return (
        <div className="flex flex-row">
            <SideBar isAdmin={isAdmin} name={name} />
            <div className="p-3">
                <div className="pt-6 pb-4 pl-4 text-xl font-semibold border-b border-b-gray-500">
                    All Users
                </div>

                <div className="grid grid-cols-4 gap-4 py-3 px-4 font-semibold border-b border-gray-500">
                    <div>First Name</div>
                    <div>Middle Name</div>
                    <div>Last Name</div>
                    <div>Email</div>
                </div>

                {users.map((user, index) => (
                    <div
                        key={`${user.email}-${index}`}
                        className="grid grid-cols-4 gap-4 py-3 px-4 border-b border-gray-300"
                    >
                        {" "}
                        <div>{user.firstName}</div>
                        <div>{user.middleName || ""}</div>
                        <div>{user.lastName}</div>
                        <div>
                            {user.email}
                            {user.admin ? " (admin)" : ""}
                        </div>
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

    const usersFromDB = await User.find(
        {},
        "firstName middleName lastName email admin",
    ).lean();

    const users: UserRow[] = usersFromDB.map((user: any) => ({
        firstName: user.firstName || "",
        middleName: user.middleName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        admin: user.admin || false,
    }));

    return {
        props: {
            isAdmin: true,
            users,
            name: user.firstName + " " + user.lastName,
        },
    };
};
