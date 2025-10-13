import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onSave: () => void;
  onToggleView?: (view: string) => void;
}

export const useKeyboardShortcuts = ({ onSave, onToggleView }: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+S or Cmd+S for save
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        onSave();
      }
      
      // Number keys for view switching
      if (onToggleView) {
        switch (event.key) {
          case '1':
            onToggleView('today');
            break;
          case '2':
            onToggleView('week');
            break;
          case '3':
            onToggleView('notes');
            break;
          case '4':
            onToggleView('statistics');
            break;
          case '5':
            onToggleView('export');
            break;
          case '6':
            onToggleView('calendar');
            break;
          case '7':
            onToggleView('database');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onSave, onToggleView]);
};
