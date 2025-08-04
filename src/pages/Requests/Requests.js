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

  const endpoints = [
    'request-all-get/',
    'request-initial-stages-get/',
    'request-in-progress-get/',
    'request-completed-get/',
    'request-rejected-get/',
  ];

const [requestsData, setRequestsData] = useState([
    {
      url: `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary`,
      data: null,
      page: 1,
      pageCount: 1,
      loading: false,
    },
    {
      url: `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary`,
      data: null,
      page: 1,
      pageCount: 1,
      loading: false,
    },
    {
      url: `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary`,
      data: null,
      page: 1,
      pageCount: 1,
      loading: false,
    },
    {
      url: `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary`,
      data: null,
      page: 1,
      pageCount: 1,
      loading: false,
    },
    {
      url: `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary`,
      data: null,
      page: 1,
      pageCount: 1,
      loading: false,
    },
  ]);
  const [activeEndpoint, setActiveEndpoint] = useState(0);
  const loadInitialData = async (index) => {
    const apiUrl = `${requestsData[index].url}/${localStorage.getItem('user_id')}/${endpoints[index]}`;

    try {
      const response = await fetch(`${apiUrl}?page=1`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('access_token')}`,
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
      console.error('Fetch error:', error);
    }
  };
  useEffect(() => {
    const fetchSequentially = async () => {
      const token = localStorage.getItem('access_token');
      const userId = localStorage.getItem('user_id');

      if (!token || !userId) return false; // Exit if no credentials

      try {
        for (let i = 0; i < requestsData.length; i++) {
          if (activeEndpoint === i && !requestsData[i].data) {
            loadInitialData(i);
          }
        }
      } catch (error) {
        console.error('Sequential fetch error:', error);
      }
    };

    fetchSequentially();
  }, [activeEndpoint]);

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
