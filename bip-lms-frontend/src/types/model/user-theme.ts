export type UserTheme = {
    id: string;
    userId: string;
    portal: string;
    theme: Theme;
    createdAt: string;
    updatedAt: string;
}

type Theme = {
            scale: number,
            theme: string,
            ripple: boolean,
            menuMode: string,
            inputStyle: string,
            colorScheme: "dark" | "light"
}