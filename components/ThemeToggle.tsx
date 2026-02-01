"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = React.useState(false)


    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <button className="rounded-md p-2 hover:bg-slate-200 dark:hover:bg-slate-800">
                <div className="h-5 w-5" />
            </button>
        )
    }

    return (
        <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-md p-2 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Theme"
        >
            {theme === "light" ? (
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            ) : (
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                // Note: The absolute positioning here might be tricky if not in a container. 
                // Let's simplify efficiently without fancy rotate animation for now to avoid layout shift issues if CSS not perfect.
                // Actually, let's keep it simple.
            )}
            {theme === "dark" && <Moon className="h-5 w-5" />}
        </button>
    )
}

// Improved version without absolute hacking usually requires specific CSS. 
// Let's rewrite to be safer standard toggle.
export function ThemeToggleSimple() {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
        >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
    )
}
