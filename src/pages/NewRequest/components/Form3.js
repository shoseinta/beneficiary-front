import { useEffect, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Header from "../../../components/header/Header";
import NavigationBar from "../../../components/navigationBar/NavigationBar";
import step1_completed from '../../../media/icons/step1_completed.svg';
import step2_completed from '../../../media/icons/step2_completed.svg';
import step3_active from '../../../media/icons/step3_active.svg';
import step4 from '../../../media/icons/step4.svg';
import attach_icon from '../../../media/icons/attach_icon.svg';
import next_icon from '../../../media/icons/next_icon.svg';
import back_icon from '../../../media/icons/back_icon.svg';
import './Form3.css'
import { useLookup } from "../../../context/LookUpContext";

function Form3({ requestData, setRequestData, setStep, files, setFiles }) {
    
    const [isCreatingZip, setIsCreatingZip] = useState(false);

    useEffect(() => {
      console.log(files)
    })

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
    
    // Create new zip from updated list
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


    const handleFileChange = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(pre => {
          return [...pre,...selectedFiles]
        });
        
        if (selectedFiles.length > 0) {
            setIsCreatingZip(true);
            try {
                const zip = new JSZip();
                
                // Add each file to the zip
                files.forEach((file, index) => {
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

    useEffect(()=>{
        document.documentElement.classList.add('form3-html')
        document.body.classList.add('form3-body')

        return ()=>{
            document.documentElement.classList.remove('form3-html')
            document.body.classList.remove('form3-body')
        }
    },[])

    return (
        <div className="form3-container">
            <Header />
            <main className="main">
    <nav className="nav-up">
      <ol className="nav-list-up">
        <li className="nav-item-up step-completed">
          <div> 
            <span className="step-icon"><img src={step1_completed} alt="" /></span>
            <p> نوع درخواست </p> 
          </div>
        </li>
        <li className="nav-item-up step-completed">
          <div> 
            <span className="step-icon"><img src={step2_completed} alt="" /></span>
            <p> تعیین تاریخ </p> 
          </div>
        </li>
        <li className="nav-item-up" id="active-nav-up">
          <div> 
            <span className="step-icon"><img src={step3_active} alt="" /></span>
            <p> اطلاعات تکمیلی </p>
          </div>
        </li>
        <li className="nav-item-up">
          <div> 
            <span className="step-icon"><img src={step4} alt="" /></span>
            <p> تأیید نهایی </p> 
          </div>
        </li>
      </ol>
    </nav>

    <form className="form">
      <div className="form-title input-space">
        <label className="label-space" htmlFor="form-title-id"> می‌خواهید برای درخواست خود یک عنوان بنویسید؟ </label>
        <input type="text" id="form-title-id" value={requestData.beneficiary_request_title || ''} 
                onChange={handleTitleChange} required />
      </div>

      <div className="form-description input-space">
        <label htmlFor="form-description-id" className="label-space"> می‌خواهید برای درخواست خود توضیحات اضافی بنویسید؟</label>
        <textarea id="form-description-id" value={requestData.beneficiary_request_description || ''} 
                onChange={handleDescriptionChange}></textarea>
      </div>
      
      <div className="form-document input-space">
        <label htmlFor="form-document-id" className="label-space"> می‌خواهید برای درخواست خود مستندات مورد نیاز را بارگذاری کنید؟</label>
        <input type="file" id="form-document-id" multiple hidden onChange={handleFileChange}/>
        <label htmlFor="form-document-id" className="upload-label">
          <img src={attach_icon} alt="" />
          برای انتخاب فایل کلیک کنید
        </label>
        {files.length > 0 && (
          <div className="selected-files">
            {files.map((file, index) => (
              <div key={index} className="file-item">
                <span 
                  className="file-name" 
                  onClick={() => window.open(URL.createObjectURL(file), '_blank')}
                >
                  {file.name}
                </span>
                <button 
                  className="remove-file-btn" 
                  onClick={() => handleRemoveFile(index)}
                  type="button"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

      </div>

      <div></div>
    </form>

    <div className="next-back-btn">
      <button onClick={() => setStep(pre => pre - 1)}>
        <img src={back_icon} alt=" " />
        <span> قبلی</span>
      </button>

      <button onClick={() => setStep(pre => pre + 1)} >
        <span> بعدی</span>
        <img src={next_icon} alt=" " />
      </button>
    </div>

    <div></div>
  </main>
            

            <NavigationBar selected={2}/>
        </div>
    );
}

export default Form3;