import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { MOCK_FILES, FOLDERS as INITIAL_FOLDERS } from '../data/mockFiles';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [files, setFiles] = useState(MOCK_FILES);
  const [folders, setFolders] = useState(INITIAL_FOLDERS);
  const [trash, setTrash] = useState([]);
  const [kept, setKept] = useState([]);
  const [organized, setOrganized] = useState([]);
  
  // Settings
  const [asmrMode, setAsmrMode] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [swipeSound, setSwipeSound] = useState('default'); // 'default', 'pop', 'arcade'
  const [animationSpeed, setAnimationSpeed] = useState('medium'); // 'slow', 'medium', 'fast'
  const [confirmDeletion, setConfirmDeletion] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  
  // New Settings
  const [autoEmptyTrash, setAutoEmptyTrash] = useState('never');
  const [ignoreScreenshots, setIgnoreScreenshots] = useState(false);

  const [toasts, setToasts] = useState([]);
  const [savedMB, setSavedMB] = useState(0);
  // 'main' | 'trash' | 'settings' | 'sources' | 'stats' | 'multiselect' | 'appcleaner'
  const [view, setView] = useState('main');
  const [activeSource, setActiveSource] = useState('all');
  const [activeTypeFilter, setActiveTypeFilter] = useState('all');
  const [previewFile, setPreviewFile] = useState(null);
  const [gridMode, setGridMode] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [swipeCount, setSwipeCount] = useState(0);
  const [newBadge, setNewBadge] = useState(null);

  // Filtered files based on source and type
  const filteredFiles = useMemo(() => {
    let result = files;
    if (activeSource !== 'all') {
      result = result.filter(f => f.source === activeSource);
    }
    if (activeTypeFilter !== 'all') {
      if (activeTypeFilter === 'large') {
        result = result.filter(f => f.size > 10);
      } else {
        result = result.filter(f => f.type === activeTypeFilter);
      }
    }
    return result;
  }, [files, activeSource, activeTypeFilter]);

  // Stats for badges
  const stats = useMemo(() => ({
    totalSwiped: swipeCount,
    totalTrashed: trash.length,
    totalOrganized: organized.length,
    savedMB,
    allReviewed: files.length === 0,
  }), [swipeCount, trash.length, organized.length, savedMB, files.length]);

  const addToast = useCallback((message, type = 'info', fileId = null) => {
    const id = Date.now();
    setToasts([{ id, message, type, fileId }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts([]);
  }, []);

  const checkBadges = useCallback((updatedStats) => {
    // Lazy import to avoid circular
    import('../data/mockFiles.js').then(({ BADGES }) => {
      for (const badge of BADGES) {
        if (badge.requirement(updatedStats)) {
          const alreadyShown = sessionStorage.getItem(`badge_${badge.id}`);
          if (!alreadyShown) {
            sessionStorage.setItem(`badge_${badge.id}`, 'true');
            setNewBadge(badge);
            setTimeout(() => setNewBadge(null), 3000);
            break;
          }
        }
      }
    });
  }, []);

  const incrementSwipe = useCallback(() => {
    setSwipeCount(prev => {
      const newCount = prev + 1;
      return newCount;
    });
  }, []);

  const triggerHaptic = useCallback((pattern = [15]) => {
    if (hapticFeedback && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, [hapticFeedback]);

  const moveToTrash = useCallback((file) => {
    setFiles(prev => prev.filter(f => f.id !== file.id));
    setTrash(prev => [{ ...file, trashedAt: Date.now() }, ...prev]);
    setSavedMB(prev => prev + file.size);
    incrementSwipe();
    triggerHaptic([20, 30, 20]);
    addToast(`Moved "${file.name}" to Trash`, 'trash', file.id);
  }, [addToast, incrementSwipe, triggerHaptic]);

  const keepFile = useCallback((file) => {
    setFiles(prev => prev.filter(f => f.id !== file.id));
    setKept(prev => [file, ...prev]);
    incrementSwipe();
    triggerHaptic([10]);
    addToast(`"${file.name}" kept!`, 'keep');
  }, [addToast, incrementSwipe, triggerHaptic]);

  const permanentDelete = useCallback((file) => {
    setFiles(prev => prev.filter(f => f.id !== file.id));
    setSavedMB(prev => prev + file.size);
    incrementSwipe();
    triggerHaptic([30, 50, 30]);
    addToast(`Permanently deleted "${file.name}"`, 'delete');
  }, [addToast, incrementSwipe, triggerHaptic]);

  const organizeFile = useCallback((file, folder) => {
    setFiles(prev => prev.filter(f => f.id !== file.id));
    setOrganized(prev => [{ ...file, folder }, ...prev]);
    incrementSwipe();
    triggerHaptic([10, 20]);
    addToast(`Moved to ${folder.name}`, 'folder');
  }, [addToast, incrementSwipe, triggerHaptic]);

  const restoreFromTrash = useCallback((fileId) => {
    const file = trash.find(f => f.id === fileId);
    if (!file) return;
    const { trashedAt, ...original } = file;
    setTrash(prev => prev.filter(f => f.id !== fileId));
    setFiles(prev => [original, ...prev]);
    setSavedMB(prev => Math.max(0, prev - file.size));
    addToast(`"${file.name}" restored!`, 'restore');
  }, [trash, addToast]);

  const emptyTrash = useCallback(() => {
    const totalMB = trash.reduce((sum, f) => sum + f.size, 0);
    setTrash([]);
    triggerHaptic([30, 50, 30, 50, 30]);
    addToast(`Trash emptied! Freed ${totalMB.toFixed(1)} MB`, 'delete');
  }, [trash, addToast, triggerHaptic]);

  const restoreAllTrash = useCallback(() => {
    setFiles(prev => [...trash.map(({ trashedAt, ...f }) => f), ...prev]);
    const totalMB = trash.reduce((sum, f) => sum + f.size, 0);
    setSavedMB(prev => Math.max(0, prev - totalMB));
    setTrash([]);
    addToast(`Restored ${trash.length} files`, 'restore');
  }, [trash, addToast]);

  const undoLastAction = useCallback((fileId) => {
    restoreFromTrash(fileId);
  }, [restoreFromTrash]);

  // Multi-select actions
  const toggleSelectFile = useCallback((fileId) => {
    setSelectedFiles(prev => {
      const next = new Set(prev);
      if (next.has(fileId)) next.delete(fileId);
      else next.add(fileId);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedFiles(new Set(filteredFiles.map(f => f.id)));
  }, [filteredFiles]);

  const deselectAll = useCallback(() => {
    setSelectedFiles(new Set());
  }, []);

  const batchDelete = useCallback((ids = null) => {
    const targetIds = ids || selectedFiles;
    if (targetIds.size === 0) return;

    const selected = files.filter(f => targetIds.has(f.id));
    const totalMB = selected.reduce((sum, f) => sum + f.size, 0);
    
    setFiles(prev => prev.filter(f => !targetIds.has(f.id)));
    setTrash(prev => [...selected.map(f => ({ ...f, trashedAt: Date.now() })), ...prev]);
    
    setSavedMB(prev => prev + totalMB);
    triggerHaptic([20, 30, 20, 30, 20]);
    addToast(`Moved ${selected.length} items to trash`, 'trash');
    
    if (!ids) setSelectedFiles(new Set());
  }, [files, selectedFiles, addToast, triggerHaptic]);

  const batchKeep = useCallback(() => {
    const selected = files.filter(f => selectedFiles.has(f.id));
    setFiles(prev => prev.filter(f => !selectedFiles.has(f.id)));
    setKept(prev => [...selected, ...prev]);
    addToast(`Kept ${selected.length} files`, 'keep');
    setSelectedFiles(new Set());
  }, [files, selectedFiles, addToast]);

  const createFolder = useCallback((name) => {
    const newFolder = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      icon: '📁',
      color: '#4f7cff'
    };
    setFolders(prev => [...prev, newFolder]);
    return newFolder;
  }, []);

  return (
    <AppContext.Provider value={{
      files, filteredFiles, folders, createFolder, trash, kept, organized,
      asmrMode, setAsmrMode,
      hapticFeedback, setHapticFeedback,
      swipeSound, setSwipeSound,
      animationSpeed, setAnimationSpeed,
      confirmDeletion, setConfirmDeletion,
      darkMode, setDarkMode,
      autoEmptyTrash, setAutoEmptyTrash,
      ignoreScreenshots, setIgnoreScreenshots,
      toasts, addToast, removeToast,
      savedMB, swipeCount, stats, newBadge, setNewBadge,
      view, setView,
      activeSource, setActiveSource,
      activeTypeFilter, setActiveTypeFilter,
      previewFile, setPreviewFile,
      gridMode, setGridMode,
      selectedFiles, toggleSelectFile, selectAll, deselectAll, batchDelete, batchKeep,
      moveToTrash, keepFile, permanentDelete, organizeFile,
      restoreFromTrash, emptyTrash, restoreAllTrash, undoLastAction,
      triggerHaptic,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
