import Image from "next/image";
import Link from "next/link";

export default function Nav() {
    return (
        <nav className="container mx-auto flex w-full fixed top-0 left-0 right-0 z-50 justify-between items-center py-8">
            <div>
                <Link href="/">
                    <Image src="/triumph-logo.svg" alt="Triumph" width={500} height={500} className="w-30 h-auto" />
                </Link>

            </div>
            <div className="absolute left-1/2 -translate-x-1/2 flex space-x-8 text-[#F4E590]">
                <Link href="/">Administrator, Faculty, and Staff</Link>
                <Link href="/">University Events</Link>
                <Link href="/">Messages</Link>
            </div>
        </nav>
    );
}