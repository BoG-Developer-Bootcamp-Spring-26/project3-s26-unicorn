import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

export default function SideBar({ isAdmin }: { isAdmin: boolean }) {
    const router = useRouter();

    const regularLinks = [
        {
            label: "Training Logs",
            href: "/training-logs",
            activeImg: "/images/activeTrainingLogo.png",
            inactiveImg: "/images/inactiveTrainingLogs.png",
        },
        {
            label: "Animals",
            href: "/animals",
            activeImg: "/images/activeAnimalsLogo.png",
            inactiveImg: "/images/inactiveAnimalLogo.png",
        },
    ];

    const adminLinks = [
        {
            label: "All users",
            href: "/all-users",
            activeImg: "/images/activeAllUsersLogo.png",
            inactiveImg: "/images/inactiveAllUsersLogo.png",
        },
        {
            label: "All training",
            href: "/all-training",
            activeImg: "/images/activeAllTrainingLogo.png",
            inactiveImg: "/images/inactiveAllTrainingLogo.png",
        },
        {
            label: "All animals",
            href: "/all-animals",
            activeImg: "/images/activeAllAnimalsLogo.png",
            inactiveImg: "/images/inactiveAnimalLogo.png",
        },
    ];
    const logoutLink = {
        label: "Log Out",
        href: "/",
        activeImg: "/images/logoutLogo.png",
        inactiveImg: "/images/logoutLogo.png",
    };
    return (
        <div className="flex fixed left-0 top-20 bottom-0 flex-col w-64 border-r border-gray-200">
            <nav className="flex flex-col h-full p-4 mt-4">
                <div className="flex flex-col gap-2">
                {regularLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`p-3 rounded-lg transition-all hover:bg-[#D21312] ${router.pathname === link.href ? "bg-[#D21312] font-bold" : ""}`}
                    >
                        <div className="flex flex-row">
                            <Image
                                src={
                                    router.pathname === link.href
                                        ? link.activeImg
                                        : link.inactiveImg
                                }
                                width={20}
                                height={20}
                                alt={link.label}
                                className="pr-2 w-7 h-5"
                            />
                            {link.label}
                        </div>
                    </Link>
                ))}

                {isAdmin && (
                    <>
                        <hr className="my-2 border-gray-200" />
                        <p className="pl-2 font-bold">Admin access</p>
                        {adminLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`p-3 rounded-lg transition-all hover:bg-[#D21312] ${router.pathname === link.href ? "bg-[#D21312] font-bold" : ""}`}
                            >
                                <div className="flex flex-row">
                                    <Image
                                        src={
                                            router.pathname === link.href
                                                ? link.activeImg
                                                : link.inactiveImg
                                        }
                                        width={5}
                                        height={5}
                                        alt={link.label}
                                        className="pr-2 w-7 h-5"
                                    />
                                    {link.label}
                                </div>
                            </Link>
                        ))}
                    </>
                )}
                </div>

                <Link
                    href={logoutLink.href}
                    className="mt-auto p-3 rounded-lg transition-all hover:bg-[#D21312]"
                >
                    <div className="flex flex-row">
                        <Image
                            src={logoutLink.inactiveImg}
                            width={20}
                            height={20}
                            alt={logoutLink.label}
                            className="pr-2 w-7 h-5"
                        />
                        {logoutLink.label}
                    </div>
                </Link>
            </nav>
        </div>
    );
}
