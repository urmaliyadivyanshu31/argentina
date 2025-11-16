'use client';

import { createContext } from 'react';

export const CommandPaletteContext = createContext({
  isCommandPaletteOpen: false,
  setIsCommandPaletteOpen: () => {},
});
