import { useEffect, useState, useRef } from "react";
import NavigationBar from "../../components/navigationBar/NavigationBar";
import RequestsList from "./components/RequestsList";
import { useLookup } from "../../context/LookUpContext";

function Requests() {
    const {requestsData,setRequestsData, activeEndpoint, setActiveEndpoint} = useLookup()
    
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
            const response = await fetch(`${current.url}?page=${nextPage}`, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
            });

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
            console.error("Pagination error:", error);
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
            requestsData[activeEndpoint].page < requestsData[activeEndpoint].pageCount &&
            !requestsData[activeEndpoint].loading
        ) {
            loadNextPage(activeEndpoint);
        }
    };
    return (
        <>
            {/* Tabs */}
            {['all', 'initial stages', 'in progress', 'completed', 'rejected'].map((label, index) => (
                <div
                    key={index}
                    onClick={() => setActiveEndpoint(index)}
                    style={{
                        padding: '10px',
                        margin: '5px',
                        border: activeEndpoint === index ? '2px solid blue' : '1px solid gray',
                        cursor: 'pointer',
                        display: 'inline-block',
                    }}
                >
                    {label}
                </div>
            ))}

            {/* Scrollable request list area */}
            {/* One scrollable container per tab */}
            {requestsData.map((endpoint, index) => (
                <div
                    key={index}
                    onScroll={(e) => activeEndpoint === index && handleScroll(e)}
                    style={{
                        display: activeEndpoint === index ? 'block' : 'none',
                        height: '60vh',
                        overflowY: 'auto',
                        border: '1px solid #ccc',
                        margin: '10px',
                        padding: '10px'
                    }}
                >
                    <RequestsList
                        data={endpoint.data}
                        setRequestsData={setRequestsData}
                        activeEndpoint={index}
                    />
                    {endpoint.loading && (
                        <div style={{ textAlign: 'center', padding: '10px', color: 'gray' }}>Loading more...</div>
                    )}
                </div>
            ))}


            <NavigationBar />
        </>
    );
}

export default Requests;
