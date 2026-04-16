import SearchBar from "@/components/SearchBar";
import SideBar from "@/components/SideBar";
import { GetServerSideProps } from "next";
import connectDB from "@/db/connectDB";
import { User } from "@/db/models/User";

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
    const user = await User.findById(userId);
    return { props: { isAdmin: user.admin } };
};

export default function Animals({ isAdmin }: { isAdmin: boolean }) {
    return (
        <div>
            <SideBar isAdmin={isAdmin} />
            <div className="pt-6 pl-4 ml-64 border-b border-b-gray-500">Animals</div>
        </div>
    );
}
