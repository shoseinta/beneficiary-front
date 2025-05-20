// context/LookupContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const LookupContext = createContext();

export const useLookup = () => useContext(LookupContext);

export const LookupProvider = ({ children }) => {
  const [activeEndpoint, setActiveEndpoint] = useState(0);
  const endpoints = [
        'request-all-get/',
        'request-initial-stages-get/',
        'request-in-progress-get/',
        'request-completed-get/',
        'request-rejected-get/',
      ];
  const [requestsData, setRequestsData] = useState([
    {
        url: `http://localhost:8000/beneficiary-platform/beneficiary`,
        data: null,
        page: 1,
        pageCount: 1,
        loading: false,
    },
    {
        url: `http://localhost:8000/beneficiary-platform/beneficiary`,
        data: null,
        page: 1,
        pageCount: 1,
        loading: false,
    },
    {
        url: `http://localhost:8000/beneficiary-platform/beneficiary`,
        data: null,
        page: 1,
        pageCount: 1,
        loading: false,
    },
    {
        url: `http://localhost:8000/beneficiary-platform/beneficiary`,
        data: null,
        page: 1,
        pageCount: 1,
        loading: false,
    },
    {
        url: `http://localhost:8000/beneficiary-platform/beneficiary`,
        data: null,
        page: 1,
        pageCount: 1,
        loading: false,
    },
]);
  const loadInitialData = async (index) => {
        const apiUrl = `${requestsData[index].url}/${localStorage.getItem('user_id')}/${endpoints[index]}`;
        

        try {
            const response = await fetch(`${apiUrl}?page=1`, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            setRequestsData((prev) => {
                const newState = [...prev];
                newState[index].data = [...data.results];
                newState[index].page = 1;
                newState[index].pageCount = Math.max(1, Math.ceil(data.count / 10));
                newState[index].loading = false;
                return newState;
            });
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };
  const [typeLayerOne, setTypeLayerOne] = useState([]);
  const [typeLayerTwo, setTypeLayerTwo] = useState([]);
  const [processingStage, setProcessingStage] = useState([]);
  const [duration, setDuration] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
  const interval = setInterval(() => {
    const token = localStorage.getItem('access_token');
    const userId = localStorage.getItem('user_id');

    if (token && userId) {
      // fetch all request endpoints
      requestsData.forEach((request, index) => {
        if (!request.data) {
          loadInitialData(index);
        }
      });
      clearInterval(interval); // stop polling after token is found
    }
  }, 500); // check every 500ms

  return () => clearInterval(interval);
}, []);

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
        cities,
        requestsData,
        setRequestsData,
        activeEndpoint,
        setActiveEndpoint,
      }}
    >
      {children}
    </LookupContext.Provider>
  );
};
