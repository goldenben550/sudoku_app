import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { DEFAULT_THEME_ID } from './themes'

const STORAGE_KEY = 'sudoku:theme'

interface ThemeContextValue {
  themeId: string
  setThemeId: (id: string) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function loadStoredTheme(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_THEME_ID
  } catch {
    return DEFAULT_THEME_ID
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState(loadStoredTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeId)
    try {
      localStorage.setItem(STORAGE_KEY, themeId)
    } catch {
      // localStorage may be unavailable (private browsing) - theme just won't persist
    }
  }, [themeId])

  return <ThemeContext.Provider value={{ themeId, setThemeId }}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
