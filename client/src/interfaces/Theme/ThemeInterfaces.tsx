interface ThemeContextType {
    theme: ThemeType;
}
interface ThemeProviderProps {
    current_theme: string;
    children: React.ReactNode;
}
interface ThemeType {
    text: {
      TITLE: string;
      ALERT_SUCCESS: string;
      ALERT_SUCCESS_VAR_1: string;
      ALERT_SUCCESS_VAR_2: string;
      ALERT_ERROR: string;
      ALERT_ERROR_VAR_1: string;
    };
    styles: {
      primaryColor: string;
      secondaryColor: string;
      tertiaryColor: string;
    };
}
const DefaultTheme: ThemeType = {
    text: {
        TITLE: 'Bookeeper',
        ALERT_SUCCESS: 'Success!',
        ALERT_SUCCESS_VAR_1: 'Success!',
        ALERT_SUCCESS_VAR_2: 'Success!',
        ALERT_ERROR: 'Error!',
        ALERT_ERROR_VAR_1: 'Error!}',
        },
    styles: {
        primaryColor: 'pink',
        secondaryColor: 'violet',
        tertiaryColor: 'purple',
    },
}
const DefaultThemeContextType: ThemeContextType = {
    theme: DefaultTheme,  
}
export type { ThemeContextType, ThemeProviderProps, ThemeType };
export { DefaultThemeContextType, DefaultTheme };