function Form4({ requestData, onetimeData, recurringData, typeLayerOne, typeLayerTwo, duration }) {
    // Function to render file preview based on file type
    const renderFilePreview = () => {
        const file = requestData.beneficiary_request_document;
        
        if (!file) {
            return <p>No file selected</p>;
        }

        // Check file type
        const fileType = file.type.split('/')[0]; // 'image', 'application', etc.
        const fileUrl = URL.createObjectURL(file); // Create a temporary URL for preview

        switch (fileType) {
            case 'image':
                return (
                    <div>
                        <img 
                            src={fileUrl} 
                            alt="Preview" 
                            style={{ maxWidth: '200px', maxHeight: '200px' }} 
                        />
                        <p>{file.name}</p>
                    </div>
                );
            case 'application':
                if (file.type.includes('pdf')) {
                    return (
                        <div>
                            <iframe 
                                src={fileUrl} 
                                width="200" 
                                height="200"
                                title="PDF Preview"
                            />
                            <p>{file.name}</p>
                        </div>
                    );
                }
                // Fallthrough for other application types
            default:
                return (
                    <div>
                        <p>File: {file.name}</p>
                        <p>(No preview available for this file type)</p>
                    </div>
                );
        }
    };

    return (
        <>
            <div style={{ border: '1px solid blue' }}>
                <p>
                    type layer1: {
                        typeLayerOne.find(
                            element => element.beneficiary_request_type_layer1_id === 
                            requestData.beneficiary_request_type_layer1
                        )?.beneficiary_request_type_layer1_name || 'Not selected'
                    }
                </p>
                <p>
                    type layer2: {
                        typeLayerTwo.find(
                            element => element.beneficiary_request_type_layer2_id === 
                            requestData.beneficiary_request_type_layer2
                        )?.beneficiary_request_type_layer2_name || 'Not selected'
                    }
                </p>
                <p>amount: {requestData.beneficiary_request_amount}</p>
            </div>
            
            <div style={{ border: '1px solid blue' }}>
                <p>
                    duration: {
                        duration.find(
                            element => element.beneficiary_request_duration_id === 
                            requestData.beneficiary_request_duration
                        )?.beneficiary_request_duration_name || 'Not selected'
                    }
                </p>
                {requestData.beneficiary_request_duration && 
                 duration.find(d => d.beneficiary_request_duration_id === requestData.beneficiary_request_duration)?.beneficiary_request_duration_name === 'one_time' && 
                 <p>deadline: {onetimeData.beneficiary_request_duration_onetime_deadline}</p>}
                
                {requestData.beneficiary_request_duration && 
                 duration.find(d => d.beneficiary_request_duration_id === requestData.beneficiary_request_duration)?.beneficiary_request_duration_name === 'recurring' && 
                 <p>limit: {recurringData.beneficiary_request_duration_recurring_limit}</p>}
            </div>
            
            <div style={{ border: '1px solid blue' }}>
                <p>title: {requestData.beneficiary_request_title}</p>
                <p>description: {requestData.beneficiary_request_description}</p>
                <div>
                    <p>Document Preview:</p>
                    {renderFilePreview()}
                </div>
            </div>
        </>
    );
}

export default Form4;