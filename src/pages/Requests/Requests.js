import { useEffect, useState, useRef } from 'react';
import NavigationBar from '../../components/navigationBar/NavigationBar';
import RequestsList from './components/RequestsList';
import { useLookup } from '../../context/LookUpContext';
import './Requests.css'; // Assuming you have a CSS file for styling
import Header from '../../components/header/Header';

function Requests() {
  useEffect(() => {
    document.title = 'صفحه سوابق درخواست خیریه';
  }, []);


  const {
    requestsData,
    setRequestsData,
    activeEndpoint,
    setActiveEndpoint,
    setIsRequestPage,
  } = useLookup();
  const endpoints = [
    'request-all-get/',
    'request-initial-stages-get/',
    'request-in-progress-get/',
    'request-completed-get/',
    'request-rejected-get/',
  ];

  const scrollRef = useRef(null);
  const loadNextPage = async (index) => {
    const current = requestsData[index];
    const nextPage = current.page + 1;

    if (current.loading || nextPage > current.pageCount) return;

    setRequestsData((prev) => {
      const newState = [...prev];
      newState[index].loading = true;
      return newState;
    });

    try {
      const response = await fetch(
        `${current.url}/${localStorage.getItem('user_id')}/${endpoints[index]}?page=${nextPage}`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      setRequestsData((prev) => {
        const newState = [...prev];
        newState[index].data = [...newState[index].data, ...data.results];
        newState[index].page = nextPage;
        newState[index].pageCount = Math.max(1, Math.ceil(data.count / 10));
        newState[index].loading = false;
        return newState;
      });
    } catch (error) {
      console.error('Pagination error:', error);
      setRequestsData((prev) => {
        const newState = [...prev];
        newState[index].loading = false;
        return newState;
      });
    }
  };

  const handleScroll = (e) => {
    const el = e.target;
    const nearBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 100;

    if (
      nearBottom &&
      requestsData[activeEndpoint].page <
        requestsData[activeEndpoint].pageCount &&
      !requestsData[activeEndpoint].loading
    ) {
      loadNextPage(activeEndpoint);
    }
  };
  useEffect(() => {
    if (!activeEndpoint) {
      setActiveEndpoint(0);
    }
  }, [activeEndpoint]);
  useEffect(() => {
    setIsRequestPage(true);
    return () => {
      setIsRequestPage(false);
      setRequestsData((prev) => {
        const newData = prev.map((item) => {
          return { ...item, data: null, page: 1, pageCount: 1, loading: false };
        });
        return newData;
      });
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.add('requests-container-html');
    document.body.classList.add('requests-container-body');

    return () => {
      document.documentElement.classList.remove('requests-container-html');
      document.body.classList.remove('requests-container-body');
    };
  }, []);
    
  return (
    <>
    <div className="requests-container">
      {/* Tabs */}
      <Header />
      <main className="main">
        <nav className="nav-up">
          <ul className="nav-list-up">
            {[
              'همه درخواست ها',
              'درخواست های در انتظار پاسخ',
              'درخواست های تایید شده',
              'درخواست های تکمیل شده',
              'درخواست های رد شده',
            ].map((label, index) => (
              <li
                className={
                  activeEndpoint === index
                    ? 'nav-item-up active-nav-up'
                    : 'nav-item-up'
                }
                onClick={() => setActiveEndpoint(index)}
                key={index}
              >
                <a href="#" style={activeEndpoint === index? {color:"#ffffff"}:{color:"#000000"}}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Scrollable request list area */}
        {/* One scrollable container per tab */}
        {requestsData.map(
          (endpoint, index) =>
            activeEndpoint === index && (
              <div
                key={index}
                onScroll={(e) => activeEndpoint === index && handleScroll(e)}
                className="request-table-container"
              >
                <RequestsList data={endpoint.data} index={index} />
                {/* {endpoint.loading && (
                        <div style={{ textAlign: 'center', padding: '10px', color: 'gray' }}>Loading more...</div>
                    )} */}
              </div>
            )
        )}
      </main>

      <NavigationBar selected={3} />
    </div>
    </>
  );
}

export default Requests;
