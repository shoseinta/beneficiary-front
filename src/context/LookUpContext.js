// context/LookupContext.js
import { createContext, useContext, useEffect, useState } from 'react';

const LookupContext = createContext();

export const useLookup = () => useContext(LookupContext);

export const LookupProvider = ({ children }) => {
  const [fontBig,setFontBig] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  useEffect(() => {
    if(localStorage.getItem('darkMode')){
      setDarkMode(true)
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark')
    }else{
      setDarkMode(false)
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark')
    }
  },[darkMode])
  useEffect(() => {
    if(localStorage.getItem('fontSize')){
      setFontBig(true)
      document.documentElement.style.fontSize = '1.5em'
    }else{
      setFontBig(false)
      document.documentElement.style.fontSize = '1em'
    }
  },[fontBig])
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
  const [isDeleteFinished, setIsDeleteFinished] = useState(false);
  const [hamburger,setHamburger] = useState(false)
      useEffect(() => {
        if (hamburger) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    },[hamburger])
  const endpoints = [
    'request-all-get/',
    'request-initial-stages-get/',
    'request-in-progress-get/',
    'request-completed-get/',
    'request-rejected-get/',
  ];
  
  const [typeLayerOne, setTypeLayerOne] = useState([]);
  const [typeLayerTwo, setTypeLayerTwo] = useState([]);
  const [processingStage, setProcessingStage] = useState([]);
  const [duration, setDuration] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [files, setFiles] = useState([]);

  // Empty dependency array

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [
          typeLayer1Res,
          typeLayer2Res,
          processingStageRes,
          durationRes,
          provincesRes,
          citiesRes,
        ] = await Promise.all([
          fetch(
            `https://charity-backend-staging.liara.run/beneficiary-platform/requests/type-layer1/`
          ),
          fetch(
            `https://charity-backend-staging.liara.run/beneficiary-platform/requests/type-layer2/`
          ),
          fetch(
            `https://charity-backend-staging.liara.run/beneficiary-platform/requests/processing-stage/`
          ),
          fetch(
            `https://charity-backend-staging.liara.run/beneficiary-platform/requests/duration/`
          ),
          fetch(
            `https://charity-backend-staging.liara.run/beneficiary-platform/provinces/`
          ),
          fetch(
            `https://charity-backend-staging.liara.run/beneficiary-platform/cities/`
          ),
        ]);

        if (
          !typeLayer1Res.ok ||
          !typeLayer2Res.ok ||
          !processingStageRes.ok ||
          !durationRes.ok ||
          !provincesRes.ok ||
          !citiesRes.ok
        ) {
          throw new Error('One or more lookup requests failed');
        }

        const typeLayer1Data = await typeLayer1Res.json();
        const typeLayer2Data = await typeLayer2Res.json();
        const processingStageData = await processingStageRes.json();
        const durationData = await durationRes.json();
        const provincesData = await provincesRes.json();
        const citiesData = await citiesRes.json();

        setTypeLayerOne(typeLayer1Data);
        setTypeLayerTwo(typeLayer2Data);
        setProcessingStage(processingStageData);
        setDuration(durationData);
        setProvinces(provincesData);
        setCities(citiesData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLookups();
  }, []);

  

  return (
    <LookupContext.Provider
      value={{
        hamburger,
        setHamburger,
        loading,
        error,
        typeLayerOne,
        typeLayerTwo,
        processingStage,
        duration,
        provinces,
        cities,
        files,
        setFiles,
        isDeleteFinished,
        setIsDeleteFinished,
        fontBig,
        setFontBig,
        darkMode,
        setDarkMode,
        isInstalled,
        setIsInstalled,
        deferredPrompt,
        setDeferredPrompt,
        displayModeStandalone,
      }}
    >
      {children}
    </LookupContext.Provider>
  );
};
