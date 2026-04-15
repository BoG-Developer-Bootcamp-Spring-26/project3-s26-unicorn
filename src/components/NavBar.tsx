import Image from "next/image";

export default function NavBar() {
    return (
        <div className="flex sticky top-0 justify-start items-center bg-white shadow-lg shadow-gray-400">
            <Image
                src="/images/appLogo.png"
                width={83}
                height={50}
                alt={"logo"}
                className="ml-6 h-auto w-[6vw]"
            />
            <p className="font-bold text-[2rem]">Progress</p>
        </div>
    );
}
