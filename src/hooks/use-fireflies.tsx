import { useEffect, useState } from "react";

export const useGenerateFireflies = (light: number) => {
    const [fireflies, setFireflies] = useState([]);
    useEffect(() => {
        if (light === 0) {
            const fireflyArray = [];
            const quantity = 15;

            // Initial positions matching the 0% keyframe of each animation to spread them out
            const initialPositions = [
                { x: 12, y: 26 },    // move1
                { x: -23, y: 9 },   // move2
                { x: -8, y: -26 },  // move3
                { x: 0, y: 15 },    // move4
                { x: -4, y: 3 },    // move5
                { x: -26, y: -14 }, // move6
                { x: 19, y: 48 },   // move7
                { x: -30, y: 23 },  // move8
                { x: -47, y: -32 }, // move9
                { x: -26, y: -13 }, // move10
                { x: 7, y: 39 },    // move11
                { x: 7, y: -3 },    // move12
                { x: 40, y: -1 },   // move13
                { x: 46, y: 26 },   // move14
                { x: -14, y: -28 }, // move15
            ];

            for (let i = 1; i <= quantity; i++) {
                const pos = initialPositions[i - 1] || { x: 0, y: 0 };
                fireflyArray.push(
                    <div
                        key={i}
                        className={`firefly firefly-${i}`}
                        style={{
                            transform: `translateX(${pos.x}vw) translateY(${pos.y}vh)`
                        }}
                    ></div>
                );
            }
            setFireflies(fireflyArray as never[]);
        } else {
            setFireflies([]);
        }
    }, [light]);

    return fireflies;
};