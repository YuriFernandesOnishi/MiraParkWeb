"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { IoMoonSharp, IoSunnySharp } from "react-icons/io5";

export default function DarkLightToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="h-12" aria-hidden />;
    }

    return (
        <div className="flex gap-4 text-3xl mt-4">
            <button
                type="button"
                aria-label="Activate theme dark"
                onClick={() => setTheme("dark")}
                className={`p-2 rounded ${theme === "dark" ? "bg-muted" : ""}`}
            >
                <IoMoonSharp />
            </button>

            <button
                type="button"
                aria-label="Activate theme light"
                onClick={() => setTheme("light")}
                className={`p-2 rounded ${theme === "light" ? "bg-muted" : ""}`}
            >
                <IoSunnySharp />
            </button>

          {/* <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>Toggle</button> */}

        </div>
    );
}
