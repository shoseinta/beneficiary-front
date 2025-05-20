// context/LookupContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const LookupContext = createContext();

export const useLookup = () => useContext(LookupContext);

export const LookupProvider = ({ children }) => {
  const [typeLayerOne, setTypeLayerOne] = useState([]);
  const [typeLayerTwo, setTypeLayerTwo] = useState([]);
  const [processingStage, setProcessingStage] = useState([]);
  const [duration, setDuration] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [typeLayer1Res, typeLayer2Res, processingStageRes, durationRes, provincesRes, citiesRes] = await Promise.all([
          fetch(`http://localhost:8000/beneficiary-platform/requests/type-layer1/`),
          fetch(`http://localhost:8000/beneficiary-platform/requests/type-layer2/`),
          fetch(`http://localhost:8000/beneficiary-platform/requests/processing-stage/`),
          fetch(`http://localhost:8000/beneficiary-platform/requests/duration/`),
          fetch(`http://localhost:8000/beneficiary-platform/provinces/`),
          fetch(`http://localhost:8000/beneficiary-platform/cities/`),

        ]);

        if (!typeLayer1Res.ok || !typeLayer2Res.ok || !processingStageRes.ok || !durationRes.ok || !provincesRes.ok || !citiesRes.ok) {
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
        loading,
        error,
        typeLayerOne,
        typeLayerTwo,
        processingStage,
        duration,
        provinces,
        cities
      }}
    >
      {children}
    </LookupContext.Provider>
  );
};
