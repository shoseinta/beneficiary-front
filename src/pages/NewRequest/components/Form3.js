import { useEffect, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

function Form3({ requestData, setRequestData }) {
    const [files, setFiles] = useState([]);
    const [isCreatingZip, setIsCreatingZip] = useState(false);

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

    const handleFileChange = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
        
        if (selectedFiles.length > 0) {
            setIsCreatingZip(true);
            try {
                const zip = new JSZip();
                
                // Add each file to the zip
                selectedFiles.forEach((file, index) => {
                    zip.file(file.name, file);
                });
                
                // Generate the zip file
                const zipContent = await zip.generateAsync({ type: "blob" });
                
                // Create a File object from the zip blob
                const zipFile = new File([zipContent], "documents.zip", {
                    type: "application/zip"
                });
                
                // Update requestData with the zip file
                setRequestData(prev => ({
                    ...prev,
                    beneficiary_request_document: zipFile
                }));
                
            } catch (error) {
                console.error("Error creating zip file:", error);
            } finally {
                setIsCreatingZip(false);
            }
        } else {
            setRequestData(prev => ({
                ...prev,
                beneficiary_request_document: null
            }));
        }
    };

    useEffect(() => {
        console.log(requestData);
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
                type="file" 
                onChange={handleFileChange}
                multiple
                disabled={isCreatingZip}
            />
            
            {isCreatingZip && <p>Creating zip file...</p>}
            
            {files.length > 0 && (
                <div>
                    <p>Selected files:</p>
                    <ul>
                        {files.map((file, index) => (
                            <li key={index}>{file.name}</li>
                        ))}
                    </ul>
                    {requestData.beneficiary_request_document && (
                        <p>Zip file ready: {requestData.beneficiary_request_document.name}</p>
                    )}
                </div>
            )}
        </>
    );
}

export default Form3;