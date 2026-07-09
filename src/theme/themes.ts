export interface Theme {
  id: string
  name: string
  swatch: string
}

export const THEMES: Theme[] = [
  { id: 'blue', name: 'Classic Blue', swatch: '#1a73e8' },
  { id: 'sunset', name: 'Sunset', swatch: '#ef6c00' },
  { id: 'forest', name: 'Forest', swatch: '#1e8e3e' },
  { id: 'berry', name: 'Berry', swatch: '#c2185b' },
  { id: 'slate', name: 'Slate Dark', swatch: '#5b9df9' },
]

export const DEFAULT_THEME_ID = 'blue'
