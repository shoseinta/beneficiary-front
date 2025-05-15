import { useEffect, useState } from "react";

function Carousel({
  requestData = [], // Default to empty array
  setRequestData,
  page,
  setPage,
  pageCount,
  activeEndpoint,
  isLoading,
  setIsLoading
}) {
  const [isAtBottom, setIsAtBottom] = useState(false);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const bottom = Math.abs(scrollHeight - (scrollTop + clientHeight)) < 5;
    setIsAtBottom(bottom);
  };

  const fetchData = async (pageNum) => {
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

      const data = await response.json();
      return Array.isArray(data.results) ? data.results : [];
    } catch (error) {
      console.error("Fetch error:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreItems = async () => {
    if (isLoading || !isAtBottom || page >= pageCount) return;
    
    const nextPage = page + 1;
    const newItems = await fetchData(nextPage);
    if (newItems.length > 0) {
      setRequestData([...requestData, ...newItems]);
      setPage(nextPage);
    }
  };
  const handleCancel = async (itemId) => {
    try {
      let apiUrl;
      if(activeEndpoint === "request-announcement-get") {
        apiUrl = `http://localhost:8000/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/request-announcement-seen/${itemId}/`
      }else{
        apiUrl = `http://localhost:8000/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/announcement-seen/${itemId}/`
      }
      const response = await fetch(apiUrl, {
        method: 'GET', // or DELETE, depends on your API
        headers: {
          'Authorization': `Token ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        }
      });
  
      if (!response.ok) {
        throw new Error("Failed to cancel item");
      }
      let newData;
      if(activeEndpoint === "request-announcement-get") {
        newData = requestData.filter((item) => item.charity_announcement_for_request_id !== itemId);
      }else{
        newData = requestData.filter((item) => item.charity_announcement_to_beneficiary_id !==itemId);
      }
      // Remove the item from local state
      setRequestData(newData);
    } catch (error) {
      console.error("Cancel error:", error);
      alert("Something went wrong while cancelling the item.");
    }
  };
  
  useEffect(() => {
    if (isAtBottom) {
      loadMoreItems();
    }
  }, [isAtBottom]);

  // Ensure requestData is always an array
  const displayData = Array.isArray(requestData) ? requestData : [];

  return (
    <div>
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
          {displayData.map((item) => (
            <div key={item.charity_announcement_to_beneficiary_id || item.charity_announcement_for_request_id} style={{ marginBottom: '20px' }}>
              <h1>{item.title || item.charity_announcement_for_request_title  || item.charity_announcement_to_beneficiary_title}</h1>
              <p>{item.description || item.charity_announcement_for_request_description || item.charity_announcement_to_beneficiary_description}</p>

              <button onClick={() => handleCancel(item.charity_announcement_to_beneficiary_id || item.charity_announcement_for_request_id)} style={{ marginTop: '10px', background: 'red', color: 'white' }}>
                    dont show
              </button>
            </div>
          ))}
          {isLoading && <p>Loading more...</p>}
          {page >= pageCount && displayData.length > 0 && <p>No more results.</p>}
          {!isLoading && displayData.length === 0 && <p>No data available.</p>}
        </div>
      </div>
    </div>
  );
}

export default Carousel;