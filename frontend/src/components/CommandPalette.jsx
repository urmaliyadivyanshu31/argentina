'use client';

import { useContext, useEffect } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { CommandPaletteContext } from '../contexts/CommandPaletteContext';
import { distributionsApi } from '../lib/api';

export default function CommandPalette({ onRefresh }) {
  const { isCommandPaletteOpen, setIsCommandPaletteOpen } = useContext(CommandPaletteContext);

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsCommandPaletteOpen(false);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setIsCommandPaletteOpen]);

  const handleAction = (action) => {
    setIsCommandPaletteOpen(false);

    switch (action) {
      case 'download-template':
        distributionsApi.downloadTemplate();
        toast.success('Downloading CSV template');
        break;
      case 'refresh':
        if (onRefresh) onRefresh();
        toast.success('Refreshed distributions');
        break;
      case 'view-distributions':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        toast('Viewing distributions');
        break;
      case 'docs':
        window.open('https://docs.safe.global', '_blank');
        break;
      default:
        break;
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsCommandPaletteOpen(false)}
          />

          {/* Command Palette */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="w-full max-w-2xl"
            >
              <Command className="bg-white border border-gray-300 rounded shadow-2xl overflow-hidden">
                <div className="flex items-center border-b border-gray-200 px-4">
                  <svg
                    className="w-5 h-5 text-gray-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <Command.Input
                    placeholder="Type a command or search..."
                    className="w-full py-4 text-small bg-transparent border-none outline-none placeholder-gray-400"
                  />
                  <kbd className="text-micro text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    ESC
                  </kbd>
                </div>

                <Command.List className="max-h-96 overflow-y-auto p-2">
                  <Command.Empty className="py-8 text-center text-small text-gray-500">
                    No results found
                  </Command.Empty>

                  <Command.Group heading="Actions" className="mb-2">
                    <p className="text-micro text-gray-600 px-3 py-2">ACTIONS</p>

                    <Command.Item
                      onSelect={() => handleAction('download-template')}
                      className="flex items-center gap-3 px-3 py-3 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      <div className="flex-1">
                        <p className="text-small font-medium">Download CSV Template</p>
                        <p className="text-micro text-gray-500">Get the distribution template file</p>
                      </div>
                    </Command.Item>

                    <Command.Item
                      onSelect={() => handleAction('refresh')}
                      className="flex items-center gap-3 px-3 py-3 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <div className="flex-1">
                        <p className="text-small font-medium">Refresh Distributions</p>
                        <p className="text-micro text-gray-500">Reload the distribution list</p>
                      </div>
                    </Command.Item>

                    <Command.Item
                      onSelect={() => handleAction('view-distributions')}
                      className="flex items-center gap-3 px-3 py-3 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <div className="flex-1">
                        <p className="text-small font-medium">View All Distributions</p>
                        <p className="text-micro text-gray-500">Scroll to distributions table</p>
                      </div>
                    </Command.Item>
                  </Command.Group>

                  <Command.Separator className="h-px bg-gray-200 my-2" />

                  <Command.Group heading="Resources">
                    <p className="text-micro text-gray-600 px-3 py-2">RESOURCES</p>

                    <Command.Item
                      onSelect={() => handleAction('docs')}
                      className="flex items-center gap-3 px-3 py-3 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      <div className="flex-1">
                        <p className="text-small font-medium">Safe Documentation</p>
                        <p className="text-micro text-gray-500">Learn about Safe multisig</p>
                      </div>
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </Command.Item>
                  </Command.Group>
                </Command.List>

                <div className="border-t border-gray-200 p-3 bg-gray-50">
                  <div className="flex items-center justify-between text-micro text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>
                        <kbd className="bg-white border border-gray-300 px-1.5 py-0.5 rounded mr-1">
                          ↑↓
                        </kbd>
                        Navigate
                      </span>
                      <span>
                        <kbd className="bg-white border border-gray-300 px-1.5 py-0.5 rounded mr-1">
                          ↵
                        </kbd>
                        Select
                      </span>
                      <span>
                        <kbd className="bg-white border border-gray-300 px-1.5 py-0.5 rounded mr-1">
                          ESC
                        </kbd>
                        Close
                      </span>
                    </div>
                  </div>
                </div>
              </Command>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
