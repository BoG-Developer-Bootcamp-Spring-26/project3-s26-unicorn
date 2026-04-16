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
};

export default function AllUsers({ isAdmin, users }: AllUsersProps) {
    return (
        <div>
            <SideBar isAdmin={isAdmin} />
            <div className="ml-64">
                <div className="pt-6 pl-4 pb-4 border-b border-b-gray-500 text-xl font-semibold">
                    All Users 
                </div>

                <div className="grid grid-cols-4 gap-4 px-4 py-3 font-semibold border-b border-gray-500">
                    <div>First Name</div>
                    <div>Middle Name</div>
                    <div>Last Name</div>
                    <div>Email</div>
                </div>

                {users.map((user, index) => (
                    <div
                        key={`${user.email}-${index}`}
                        className="grid grid-cols-4 gap-4 px-4 py-3 border-b border-gray-300"
                    >
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

export const getServerSideProps: GetServerSideProps = async () => {
    await connectDB();

    const usersFromDB = await User.find({}, "firstName middleName lastName email admin").lean();

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
        },
    };
};
