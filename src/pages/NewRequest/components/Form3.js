import { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FiFile, FiImage, FiVideo, FiMusic, FiFileText, FiX } from "react-icons/fi";
import JSZip from "jszip";
import Header from "../../../components/header/Header";
import NavigationBar from "../../../components/navigationBar/NavigationBar";
import attach_icon from '../../../media/icons/attach_icon.svg';
import next_icon from '../../../media/icons/next_icon.svg';
import back_icon from '../../../media/icons/back_icon.svg';
import './Form3.css';
import { useLookup } from "../../../context/LookUpContext";
import FormHeader from "./FormHeader";

function Form3({ requestData, setRequestData, setStep, files, setFiles }) {
    const [isCreatingZip, setIsCreatingZip] = useState(false);

    const onDrop = useCallback((acceptedFiles) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
        
        if (acceptedFiles.length > 0) {
            setIsCreatingZip(true);
            const zip = new JSZip();
            
            // Add existing and new files to zip
            files.forEach(file => zip.file(file.name, file));
            acceptedFiles.forEach(file => zip.file(file.name, file));
            
            zip.generateAsync({ type: "blob" }).then(zipContent => {
                const zipFile = new File([zipContent], "documents.zip");
                setRequestData(prev => ({
                    ...prev,
                    beneficiary_request_document: zipFile
                }));
            }).finally(() => setIsCreatingZip(false));
        }
    }, [files, setFiles, setRequestData]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.heic', '.heif'],
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        },
        maxSize: 10 * 1024 * 1024, // 10MB
        multiple: true
    });

    const getFileIcon = (file) => {
        const extension = file.name.split('.').pop().toLowerCase();
        const type = file.type.split('/')[0];
        
        switch(type) {
            case 'image': return <FiImage className="file-icon" />;
            case 'video': return <FiVideo className="file-icon" />;
            case 'audio': return <FiMusic className="file-icon" />;
            default:
                switch(extension) {
                    case 'pdf': return <FiFileText className="file-icon pdf" />;
                    case 'doc':
                    case 'docx': return <FiFileText className="file-icon word" />;
                    case 'xls':
                    case 'xlsx': return <FiFileText className="file-icon excel" />;
                    case 'txt': return <FiFileText className="file-icon" />;
                    default: return <FiFile className="file-icon" />;
                }
        }
    };

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

    const handleRemoveFile = (indexToRemove) => {
        setFiles(prevFiles => {
            const updated = [...prevFiles];
            updated.splice(indexToRemove, 1);
            
            if (updated.length > 0) {
                const zip = new JSZip();
                updated.forEach(file => {
                    zip.file(file.name, file);
                });

                zip.generateAsync({ type: "blob" }).then(zipContent => {
                    const zipFile = new File([zipContent], "documents.zip", {
                        type: "application/zip"
                    });
                    setRequestData(prev => ({
                        ...prev,
                        beneficiary_request_document: zipFile
                    }));
                });
            } else {
                setRequestData(prev => ({
                    ...prev,
                    beneficiary_request_document: null
                }));
            }

            return updated;
        });
    };

    useEffect(() => {
        document.documentElement.classList.add('form3-html');
        document.body.classList.add('form3-body');

        return () => {
            document.documentElement.classList.remove('form3-html');
            document.body.classList.remove('form3-body');
        };
    }, []);

    return (
        <div className="form3-container">
            <Header />
            <main className="main">
                <FormHeader step={3} />

                <form className="form">
                    <div className="form-title input-space">
                        <label className="label-space" htmlFor="form-title-id"> می‌خواهید برای درخواست خود یک عنوان بنویسید؟ </label>
                        <input 
                            type="text" 
                            id="form-title-id" 
                            value={requestData.beneficiary_request_title || ''} 
                            onChange={handleTitleChange} 
                            required 
                        />
                    </div>

                    <div className="form-description input-space">
                        <label htmlFor="form-description-id" className="label-space"> می‌خواهید برای درخواست خود توضیحات اضافی بنویسید؟</label>
                        <textarea 
                            id="form-description-id" 
                            value={requestData.beneficiary_request_description || ''} 
                            onChange={handleDescriptionChange}
                        ></textarea>
                    </div>
                    
                    <div className="form-document input-space">
                        <label className="label-space">
                            می‌خواهید برای درخواست خود مستندات مورد نیاز را بارگذاری کنید؟
                        </label>
                        
                        <div 
                            {...getRootProps()} 
                            className={`dropzone ${isDragActive ? 'active' : ''}`}
                        >
                            {files.length === 0 &&
                            <>
                              <input {...getInputProps()} />
                            <div className="upload-content">
                                <img src={attach_icon} alt="" />
                                <p>
                                    {isDragActive ? 
                                        "فایل‌ها را اینجا رها کنید" : 
                                        "برای انتخاب مستندات کلیک کنید"}
                                </p>
                                 
                            </div>
                            </>}
                            {files.length > 0 && (
  <div className="upload-files-wrapper">
    <input {...getInputProps()} />
    <div className="upload-content-with-files">
      <img src={attach_icon} alt="" />
      <p>افزودن</p>
    </div>

    <div className="file-previews">
      {files.map((file, index) => (
        <div key={index} className="file-preview">
          <div className="file-info">
            {getFileIcon(file)}
            <span className="file-name" onClick={() => window.open(URL.createObjectURL(file))}>
              {file.name}
            </span>
            {/* <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)}MB</span> */}
          </div>
          <button
            className="remove-file"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveFile(index);
            }}
          >
            <FiX />
          </button>
        </div>
      ))}
    </div>
  </div>
)}

                        </div>
                        
                        
                    </div>
                </form>

                <div className="next-back-btn">
                    <button onClick={() => setStep(pre => pre - 1)}>
                        <img src={back_icon} alt=" " />
                        <span> قبلی</span>
                    </button>

                    <button onClick={() => setStep(pre => pre + 1)}>
                        <span> بعدی</span>
                        <img src={next_icon} alt=" " />
                    </button>
                </div>
            </main>
            
            <NavigationBar selected={2}/>
        </div>
    );
}

export default Form3;