import { createContext, useEffect, useState } from 'react';
import type { ThemeContextType, ThemeProviderProps, ThemeType } from 'src/interfaces/Theme/ThemeInterfaces';
import { DefaultThemeContextType, DefaultTheme } from 'src/interfaces/Theme/ThemeInterfaces';

export const ThemeContext = createContext<ThemeContextType>(DefaultThemeContextType);

function ThemeProvider(ThemeProviderProps: ThemeProviderProps) {
  const [themeData, setThemeData] = useState<ThemeType | void>();
  useEffect(() => {
    // Send request to read the JSON file
    if (window.ipcRenderer) {
      window.ipcRenderer.send('read-json-file', { filename: ThemeProviderProps.current_theme });
      // Listen for the response from the main process
      const handleResponse = (_: any, result: ThemeType) => {
        setThemeData(result); // Set the data in the component's state
      };
      window.ipcRenderer.on('read-json-file-response', handleResponse);

      // Clean up the event listener when the component unmounts
      return () => {
        window.ipcRenderer.removeListener('read-json-file-response', handleResponse);
      };
    }
  }, [ThemeProviderProps.current_theme]); // Rerun if `current_theme` changes

  const theme_context_value = {
    theme: themeData || DefaultTheme,
  }
  return (
    <ThemeContext.Provider value={theme_context_value}>
      {ThemeProviderProps.children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider;