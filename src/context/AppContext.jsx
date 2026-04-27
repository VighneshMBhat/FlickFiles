import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { MOCK_FILES } from '../data/mockFiles';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [files, setFiles] = useState(MOCK_FILES);
  const [trash, setTrash] = useState([]);
  const [kept, setKept] = useState([]);
  const [organized, setOrganized] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [asmrMode, setAsmrMode] = useState(true);
  const [confirmDeletion, setConfirmDeletion] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [savedMB, setSavedMB] = useState(0);
  // 'main' | 'trash' | 'settings' | 'sources' | 'stats' | 'multiselect'  
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
    totalFavorited: favorites.length,
    savedMB,
    allReviewed: files.length === 0,
  }), [swipeCount, trash.length, organized.length, favorites.length, savedMB, files.length]);

  const addToast = useCallback((message, type = 'info', fileId = null) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, fileId }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
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
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

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

  const toggleFavorite = useCallback((file) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === file.id);
      if (exists) {
        addToast(`Removed from favorites`, 'info');
        return prev.filter(f => f.id !== file.id);
      } else {
        triggerHaptic([10, 10, 10]);
        addToast(`⭐ Added to favorites!`, 'favorite');
        return [file, ...prev];
      }
    });
  }, [addToast, triggerHaptic]);

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

  const batchDelete = useCallback(() => {
    const selected = files.filter(f => selectedFiles.has(f.id));
    const totalMB = selected.reduce((sum, f) => sum + f.size, 0);
    setFiles(prev => prev.filter(f => !selectedFiles.has(f.id)));
    setTrash(prev => [...selected.map(f => ({ ...f, trashedAt: Date.now() })), ...prev]);
    setSavedMB(prev => prev + totalMB);
    triggerHaptic([20, 30, 20, 30, 20]);
    addToast(`Moved ${selected.length} files to trash`, 'trash');
    setSelectedFiles(new Set());
  }, [files, selectedFiles, addToast, triggerHaptic]);

  const batchKeep = useCallback(() => {
    const selected = files.filter(f => selectedFiles.has(f.id));
    setFiles(prev => prev.filter(f => !selectedFiles.has(f.id)));
    setKept(prev => [...selected, ...prev]);
    addToast(`Kept ${selected.length} files`, 'keep');
    setSelectedFiles(new Set());
  }, [files, selectedFiles, addToast]);

  return (
    <AppContext.Provider value={{
      files, filteredFiles, trash, kept, organized, favorites,
      asmrMode, setAsmrMode,
      confirmDeletion, setConfirmDeletion,
      darkMode, setDarkMode,
      toasts, addToast, removeToast,
      savedMB, swipeCount, stats, newBadge, setNewBadge,
      view, setView,
      activeSource, setActiveSource,
      activeTypeFilter, setActiveTypeFilter,
      previewFile, setPreviewFile,
      gridMode, setGridMode,
      selectedFiles, toggleSelectFile, selectAll, deselectAll, batchDelete, batchKeep,
      moveToTrash, keepFile, permanentDelete, organizeFile,
      toggleFavorite,
      restoreFromTrash, emptyTrash, restoreAllTrash, undoLastAction,
      triggerHaptic,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
