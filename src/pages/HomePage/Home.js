import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "../../components/carousel/Carousel";

function Home() {
  const [endpointStates, setEndpointStates] = useState({
    "request-announcement-get": {
      data: [],
      page: 1,
      pageCount: 1,
      isLoading: false,
      loaded: false
    },
    "announcement-get": {
      data: [],
      page: 1,
      pageCount: 1,
      isLoading: false,
      loaded: false
    }
  });
  const [activeEndpoint, setActiveEndpoint] = useState("request-announcement-get");

  const endpoints = {
    announcements: "request-announcement-get",
    news: "announcement-get"
  };

  const loadInitialData = async (endpoint) => {
    const currentState = endpointStates[endpoint];
    if (currentState.loaded) return;

    updateEndpointState(endpoint, { isLoading: true });
    
    try {
      const response = await fetch(
        `http://localhost:8000/beneficiary-platform/beneficiary/${
          localStorage.getItem('user_id')
        }/${endpoint}/?page=1`,
        {
          headers: {
            'Authorization': `Token ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem('access_token');
        window.location.reload();
        return;
      }

      const data = await response.json();
      updateEndpointState(endpoint, {
        data: Array.isArray(data.results) ? data.results : [],
        pageCount: Math.max(Math.ceil(data.count / 10), 1),
        loaded: true,
        isLoading: false
      });
    } catch (error) {
      console.error("Fetch error:", error);
      updateEndpointState(endpoint, { 
        data: [],
        isLoading: false 
      });
    }
  };

  const updateEndpointState = (endpoint, updates) => {
    setEndpointStates(prev => ({
      ...prev,
      [endpoint]: {
        ...prev[endpoint],
        ...updates
      }
    }));
  };

  const handleEndpointChange = (newEndpoint) => {
    setActiveEndpoint(newEndpoint);
    // No need to load initial data here if we're preserving state
  };

  useEffect(() => {
    loadInitialData("request-announcement-get");
    loadInitialData("announcement-get");
  }, []);

  const currentState = endpointStates[activeEndpoint] || { 
    data: [], 
    page: 1, 
    pageCount: 1, 
    isLoading: false 
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={() => handleEndpointChange(endpoints.announcements)}
          style={{
            background: activeEndpoint === endpoints.announcements ? '#4CAF50' : '#f1f1f1',
            color: activeEndpoint === endpoints.announcements ? 'white' : 'black'
          }}
        >
          Announcements
        </button>
        <button 
          onClick={() => handleEndpointChange(endpoints.news)}
          style={{
            background: activeEndpoint === endpoints.news ? '#4CAF50' : '#f1f1f1',
            color: activeEndpoint === endpoints.news ? 'white' : 'black'
          }}
        >
          News
        </button>
      </div>

      <div style={{ display: activeEndpoint === endpoints.announcements ? 'block' : 'none' }}>
        <Carousel
          requestData={endpointStates["request-announcement-get"].data}
          setRequestData={(newData) => updateEndpointState("request-announcement-get", { data: newData })}
          page={endpointStates["request-announcement-get"].page}
          setPage={(newPage) => updateEndpointState("request-announcement-get", { page: newPage })}
          pageCount={endpointStates["request-announcement-get"].pageCount}
          activeEndpoint="request-announcement-get"
          isLoading={endpointStates["request-announcement-get"].isLoading}
          setIsLoading={(loading) => updateEndpointState("request-announcement-get", { isLoading: loading })}
        />
      </div>

      <div style={{ display: activeEndpoint === endpoints.news ? 'block' : 'none' }}>
        <Carousel
          requestData={endpointStates["announcement-get"].data}
          setRequestData={(newData) => updateEndpointState("announcement-get", { data: newData })}
          page={endpointStates["announcement-get"].page}
          setPage={(newPage) => updateEndpointState("announcement-get", { page: newPage })}
          pageCount={endpointStates["announcement-get"].pageCount}
          activeEndpoint="announcement-get"
          isLoading={endpointStates["announcement-get"].isLoading}
          setIsLoading={(loading) => updateEndpointState("announcement-get", { isLoading: loading })}
        />
      </div>
    </div>
  );
}

export default Home;