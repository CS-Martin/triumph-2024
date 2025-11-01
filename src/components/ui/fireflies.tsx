"use client"

import { useGenerateFireflies } from "@/hooks/use-fireflies";


const Fireflies = () => {
    const fireflies = useGenerateFireflies(0);

    console.log(fireflies);

    return (
        <div className="z-50">{fireflies}</div>
    );
}

export default Fireflies;