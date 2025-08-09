import React, { createContext, useContext, useEffect, useState } from 'react';
const InstallContext = createContext();

export const useInstall = () => useContext(InstallContext);

export const InstallProvider = ({ children }) => {
    const [isInstalled, setIsInstalled] = useState(false);
      const [deferredPrompt, setDeferredPrompt] = useState(null);
      const [displayModeStandalone, setDisplayModeStandalone] = useState(
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true // iOS Safari
      );
      
        // Check if app is already installed
        
      
        // Capture install prompt
        useEffect(() => {
          const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
          };
          const onVisibility = () => {
          const standalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true;
          setDisplayModeStandalone(standalone);
        };
        document.addEventListener('visibilitychange', onVisibility);
      
          window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      
          return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            document.removeEventListener('visibilitychange', onVisibility)
          };
        }, []);
        useEffect(() => {
          const isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true;
      
          setIsInstalled(isStandalone);
        }, []);

        return (
    <InstallContext.Provider
      value={{
        isInstalled,
        setIsInstalled,
        deferredPrompt,
        setDeferredPrompt,
        displayModeStandalone,
      }}
    >
      {children}
    </InstallContext.Provider>
  );
}