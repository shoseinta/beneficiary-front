import { useEffect } from "react";

function Form3({ requestData, setRequestData }) {  // Destructure props here
    const handleTitleChange = (e) => {
        setRequestData(prev => ({
            ...prev,
            beneficiary_request_title: e.target.value
        }));
    };

    const handleDescriptionChange = (e) => {
        setRequestData(prev => ({
            ...prev,
            beneficiary_request_description: e.target.value
        }));
    };

    const handleFileChange = (e) => {
    // Get the first selected file (ignore others if multiple are selected)
    const selectedFile = e.target.files[0]; // Only take the first file
    
    setRequestData(prev => ({
        ...prev,
        beneficiary_request_document: selectedFile || null // Store only one file (or null if none)
    }));
};

    useEffect(() => {
        console.log(requestData)
    }, [requestData]);

    return (
        <>
            <p>type title</p>
            <input 
                type="text" 
                value={requestData.beneficiary_request_title || ''} 
                onChange={handleTitleChange} 
            />
            
            <p>type description</p>
            <textarea 
                value={requestData.beneficiary_request_description || ''} 
                onChange={handleDescriptionChange} 
                rows={4}
            />
            
            <p>document</p>
            <input 
                type='file' 
                onChange={handleFileChange}
            />
            
            {requestData.beneficiary_request_document && (
                <p>Selected file: {requestData.beneficiary_request_document.name}</p>
            )}
        </>
    );
}

export default Form3;