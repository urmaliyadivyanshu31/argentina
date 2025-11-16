'use client';

import { useState } from 'react';
import { CommandPaletteContext } from '../contexts/CommandPaletteContext';

export function Providers({ children }) {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  return (
    <CommandPaletteContext.Provider
      value={{ isCommandPaletteOpen, setIsCommandPaletteOpen }}
    >
      {children}
    </CommandPaletteContext.Provider>
  );
}
