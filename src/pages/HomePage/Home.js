import { useEffect, useState } from "react";
import Login from "../LoginPage/Login";
import Carousel from "../../components/carousel/Carousel";

function Home() {
  const [loadedEndpoints, setLoadedEndpoints] = useState({
    "request-announcement-get": false,
    "announcement-get": false
  });
  const [announcementData, setAnnouncementData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [announcementPage, setAnnouncementPage] = useState(1);
  const [newsPage, setNewsPage] = useState(1);
  const [announcementPageCount, setAnnouncementPageCount] = useState(1);
  const [newsPageCount, setNewsPageCount] = useState(1);
  const [isLoadingAnnouncement, setIsLoadingAnnouncement] = useState(false);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [activeEndpoint, setActiveEndpoint] = useState("request-announcement-get");

  const endpoints = {
    announcements: "request-announcement-get",
    news: "announcement-get"
  };

  const loadInitialData = async (endpoint) => {
    if (!localStorage.getItem('access_token') || loadedEndpoints[endpoint]) return;

    const isLoading = endpoint === "request-announcement-get" ? setIsLoadingAnnouncement : setIsLoadingNews;
    const setData = endpoint === "request-announcement-get" ? setAnnouncementData : setNewsData;
    const setPageCount = endpoint === "request-announcement-get" ? setAnnouncementPageCount : setNewsPageCount;

    isLoading(true);
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
      setData(data.results || []);
      setPageCount(Math.max(Math.ceil(data.count / 10), 1));
      setLoadedEndpoints(prev => ({ ...prev, [endpoint]: true }));
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      isLoading(false);
    }
  };

  const handleEndpointChange = (newEndpoint) => {
    setActiveEndpoint(newEndpoint);
    loadInitialData(newEndpoint);
  };

  useEffect(() => {
    loadInitialData("request-announcement-get");
    loadInitialData("announcement-get");
  }, []);

  if (!localStorage.getItem('access_token')) {
    return <Login />;
  }

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

      {activeEndpoint === 'request-announcement-get' ? (
        <Carousel
          requestData={announcementData}
          setRequestData={setAnnouncementData}
          page={announcementPage}
          setPage={setAnnouncementPage}
          pageCount={announcementPageCount}
          activeEndpoint={activeEndpoint}
          isLoading={isLoadingAnnouncement}
          setIsLoading={setIsLoadingAnnouncement}
        />
      ) : (
        <Carousel 
          requestData={newsData}
          setRequestData={setNewsData}
          page={newsPage}
          setPage={setNewsPage}
          pageCount={newsPageCount}
          activeEndpoint={activeEndpoint}
          isLoading={isLoadingNews}
          setIsLoading={setIsLoadingNews}
        />
      )}
    </div>
  );
}

export default Home;