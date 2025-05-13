import { useEffect, useState } from "react";
import Login from "../LoginPage/Login";

function Home() {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [requestData, setRequestData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1); // Start at 1 (minimum)
  const [isLoading, setIsLoading] = useState(false);

  // Check if the user has scrolled to the bottom
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const bottom = Math.abs(scrollHeight - (scrollTop + clientHeight)) < 5; // Tolerance for rounding errors
    setIsAtBottom(bottom);
  };

  // Fetch data for a specific page
  const fetchData = async (pageNum) => {
    if (!localStorage.getItem('access_token')) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/request-announcement-get/?page=${pageNum}`,
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
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data (page 1)
  const loadInitialData = async () => {
    const data = await fetchData(1);
    if (data) {
      setRequestData(data.results || []);
      setPageCount(Math.ceil(data.count / 10) || 1); // Adjust based on your pagination size
    }
  };

  // Load more data when reaching the bottom
  const loadMoreItems = async () => {
    if (isLoading || !isAtBottom || page >= pageCount) return;
    
    const nextPage = page + 1;
    const data = await fetchData(nextPage);
    if (data) {
      setRequestData(prev => [...prev, ...(data.results || [])]);
      setPage(nextPage);
    }
  };

  // Load page 1 on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Trigger loading more data when scrolling to the bottom
  useEffect(() => {
    if (isAtBottom) {
      loadMoreItems();
    }
  }, [isAtBottom]);

  if (!localStorage.getItem('access_token')) {
    return <Login />;
  }

  return (
    <div
      style={{
        height: '400px',
        overflowY: 'auto',
        border: '1px solid #ddd',
        padding: '10px',
        margin: '20px 0',
      }}
      onScroll={handleScroll}
    >
      <div style={{ border: '1px solid black' }}>
        {requestData.map((item) => (
          <div key={item.charity_announcement_for_request_id} style={{ marginBottom: '20px' }}>
            <h1>{item.charity_announcement_for_request_title}-سلام</h1>
            <p>{item.charity_announcement_for_request_description}</p>
          </div>
        ))}
        {isLoading && <p>Loading more...</p>}
        {page >= pageCount && <p>No more results.</p>}
      </div>
    </div>
  );
}

export default Home;