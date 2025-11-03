import Nav from "@/components/layout/nav";
import TriumphScene from "@/features/3d-model/components/triumph-scene";
import { SignOutButton } from "@clerk/nextjs";

export default function Home() {
    return (
        <>
            {/* <Nav /> */}
            <div className="flex isolate h-screen w-full relative" style={{ backgroundColor: '#010100' }}>
                <TriumphScene axes={{ x: 0, y: -28, depth: -160 }} />
            </div>
        </>
    )
}