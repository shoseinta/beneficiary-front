import { useEffect, useState } from "react";
import Login from "../../pages/LoginPage/Login";

function Carousel({requestData,setRequestData,page,setPage,pageCount,activeEndpoint,isLoading,setIsLoading}) {
  const [isAtBottom, setIsAtBottom] = useState(false);

  // Check if the user has scrolled to the bottom
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const bottom = Math.abs(scrollHeight - (scrollTop + clientHeight)) < 5;
    setIsAtBottom(bottom);
  };

  // Fetch data for a specific page
  const fetchData = async (pageNum) => {
    if (!localStorage.getItem('access_token')) return null;

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/beneficiary-platform/beneficiary/${
          localStorage.getItem('user_id')
        }/${activeEndpoint}/?page=${pageNum}`,
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
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    } finally {
      setIsLoading(false);
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
    <div>
      {/* Content area */}
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
            <div key={item.id} style={{ marginBottom: '20px' }}>
              <h1>{item.title || item.charity_announcement_for_request_title}</h1>
              <p>{item.description || item.charity_announcement_for_request_description}</p>
            </div>
          ))}
          {isLoading && <p>Loading more...</p>}
          {page >= pageCount && requestData.length > 0 && <p>No more results.</p>}
          {!isLoading && requestData.length === 0 && <p>No data available.</p>}
        </div>
      </div>
    </div>
  );
}

export default Carousel;