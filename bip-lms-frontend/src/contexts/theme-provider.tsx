"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useAuthProviderContext } from "./auth-provider";
import { useUserTheme } from "@/hooks/use-theme";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export const ThemeProviderWrapper = ({children}: {children: React.ReactNode}) => {
    const {data: userTheme, isLoading} = useUserTheme();
    console.log(userTheme);
    if(isLoading) return null;
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme={userTheme?.theme?.colorScheme || "system"}
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </ThemeProvider>
    )
}