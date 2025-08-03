import { useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  FiFile,
  FiImage,
  FiVideo,
  FiMusic,
  FiFileText,
  FiX,
} from 'react-icons/fi';
import JSZip from 'jszip';
import Header from '../../../components/header/Header';
import NavigationBar from '../../../components/navigationBar/NavigationBar';
import attach_icon from '../../../media/icons/attach_icon.svg';
import next_icon from '../../../media/icons/next_icon.svg';
import back_icon from '../../../media/icons/back_icon.svg';
import './Form3.css';
import FormHeader from './FormHeader';

function Form3({ requestData, setRequestData, setStep, files, setFiles }) {
  const [isCreatingZip, setIsCreatingZip] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFiles((prev) => [...prev, ...acceptedFiles]);

      if (acceptedFiles.length > 0) {
        setIsCreatingZip(true);
        const zip = new JSZip();

        // Add existing and new files to zip
        files.forEach((file) => zip.file(file.name, file));
        acceptedFiles.forEach((file) => zip.file(file.name, file));

        zip
          .generateAsync({ type: 'blob' })
          .then((zipContent) => {
            const zipFile = new File([zipContent], 'documents.zip');
            setRequestData((prev) => ({
              ...prev,
              beneficiary_request_document: zipFile,
            }));
          })
          .finally(() => setIsCreatingZip(false));
      }
    },
    [files, setFiles, setRequestData]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.heic', '.heif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
  });

  const getFileIcon = (file) => {
    const extension = file.name.split('.').pop().toLowerCase();
    const type = file.type.split('/')[0];

    switch (type) {
      case 'image':
        return <FiImage className="file-icon" />;
      case 'video':
        return <FiVideo className="file-icon" />;
      case 'audio':
        return <FiMusic className="file-icon" />;
      default:
        switch (extension) {
          case 'pdf':
            return <FiFileText className="file-icon" />;
          case 'doc':
          case 'docx':
            return <FiFileText className="file-icon" />;
          case 'xls':
          case 'xlsx':
            return <FiFileText className="file-icon" />;
          case 'txt':
            return <FiFileText className="file-icon" />;
          default:
            return <FiFile className="file-icon" />;
        }
    }
  };

  const handleTitleChange = (e) => {
    setRequestData((prev) => ({
      ...prev,
      beneficiary_request_title: e.target.value,
    }));
  };

  const handleDescriptionChange = (e) => {
    setRequestData((prev) => ({
      ...prev,
      beneficiary_request_description: e.target.value,
    }));
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles((prevFiles) => {
      const updated = [...prevFiles];
      updated.splice(indexToRemove, 1);

      if (updated.length > 0) {
        const zip = new JSZip();
        updated.forEach((file) => {
          zip.file(file.name, file);
        });

        zip.generateAsync({ type: 'blob' }).then((zipContent) => {
          const zipFile = new File([zipContent], 'documents.zip', {
            type: 'application/zip',
          });
          setRequestData((prev) => ({
            ...prev,
            beneficiary_request_document: zipFile,
          }));
        });
      } else {
        setRequestData((prev) => ({
          ...prev,
          beneficiary_request_document: null,
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

        <div className="form3-forms">
        <form className="form">
          <div className="form-title input-space">
            <label className="label-space" htmlFor="form-title-id">
              {' '}
              می‌خواهید برای درخواست خود یک عنوان بنویسید؟{' '}
            </label>
            <input
              type="text"
              id="form-title-id"
              value={requestData.beneficiary_request_title || ''}
              onChange={handleTitleChange}
            />
          </div>

          <div className="form-description input-space">
            <label htmlFor="form-description-id" className="label-space">
              {' '}
              می‌خواهید برای درخواست خود توضیحات اضافی بنویسید؟
            </label>
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
              {files.length === 0 && (
                <>
                  <input {...getInputProps()} />
                  <div className="upload-content">
                    <svg width="7" height="14" viewBox="0 0 7 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.04545 3.18182V10.5C6.04545 11.9064 4.90636 13.0455 3.5 13.0455C2.09364 13.0455 0.954545 11.9064 0.954545 10.5V2.54545C0.954545 1.66727 1.66727 0.954545 2.54545 0.954545C3.42364 0.954545 4.13636 1.66727 4.13636 2.54545V9.22727C4.13636 9.57727 3.85 9.86364 3.5 9.86364C3.15 9.86364 2.86364 9.57727 2.86364 9.22727V3.18182H1.90909V9.22727C1.90909 10.1055 2.62182 10.8182 3.5 10.8182C4.37818 10.8182 5.09091 10.1055 5.09091 9.22727V2.54545C5.09091 1.13909 3.95182 0 2.54545 0C1.13909 0 0 1.13909 0 2.54545V10.5C0 12.4345 1.56545 14 3.5 14C5.43455 14 7 12.4345 7 10.5V3.18182H6.04545Z" fill="black"/>
                    </svg>

                    <p>
                      {isDragActive
                        ? 'فایل‌ها را اینجا رها کنید'
                        : 'برای انتخاب مستندات کلیک کنید'}
                    </p>
                  </div>
                </>
              )}
              {files.length > 0 && (
                <div className="upload-files-wrapper">
                  <input {...getInputProps()} />
                  <div className="upload-content-with-files">
                    <svg width="7" height="14" viewBox="0 0 7 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.04545 3.18182V10.5C6.04545 11.9064 4.90636 13.0455 3.5 13.0455C2.09364 13.0455 0.954545 11.9064 0.954545 10.5V2.54545C0.954545 1.66727 1.66727 0.954545 2.54545 0.954545C3.42364 0.954545 4.13636 1.66727 4.13636 2.54545V9.22727C4.13636 9.57727 3.85 9.86364 3.5 9.86364C3.15 9.86364 2.86364 9.57727 2.86364 9.22727V3.18182H1.90909V9.22727C1.90909 10.1055 2.62182 10.8182 3.5 10.8182C4.37818 10.8182 5.09091 10.1055 5.09091 9.22727V2.54545C5.09091 1.13909 3.95182 0 2.54545 0C1.13909 0 0 1.13909 0 2.54545V10.5C0 12.4345 1.56545 14 3.5 14C5.43455 14 7 12.4345 7 10.5V3.18182H6.04545Z" fill="black"/>
                    </svg>

                    <p>افزودن</p>
                  </div>

                  <div className="file-previews">
                    {files.map((file, index) => (
                      <div key={index} className="file-preview">
                        <div className="file-info">
                          {getFileIcon(file)}
                          <span
                            className="file-name"
                            onClick={() =>
                              window.open(URL.createObjectURL(file))
                            }
                          >
                            {file.name}
                          </span>
                          {/* <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)}MB</span> */}
                        </div>
                        <button
                          className="remove-file"
                          onClick={(e) => {
                            e.preventDefault();
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
        </div>

        <div className="next-back-btn">
          <button onClick={() => setStep((pre) => pre - 1)}>
            <svg width="21" height="32" viewBox="0 0 21 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.68164 1.22266C4.26572 0.75704 5.11602 0.790223 5.66211 1.32227L19.6143 14.9258L19.7207 15.041C20.1828 15.5952 20.1828 16.4048 19.7207 16.959L19.6143 17.0742L5.66211 30.6777C5.11602 31.2098 4.26572 31.243 3.68164 30.7773L3.56836 30.6777L1.38477 28.5479C0.781478 27.9596 0.781108 26.9903 1.38379 26.4014L11.6621 16.3574L11.7285 16.2783C11.8411 16.1106 11.8411 15.8894 11.7285 15.7217L11.6621 15.6426L1.38379 5.59863C0.781108 5.00974 0.781477 4.04041 1.38477 3.45215L3.56836 1.32227L3.68164 1.22266Z" fill="#FF0000" stroke="black"/>
            </svg>

            <span> قبلی</span>
          </button>

          <button onClick={() => setStep((pre) => pre + 1)}>
            <span> بعدی</span>
            <svg width="21" height="32" viewBox="0 0 21 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.3184 1.22266C16.7343 0.75704 15.884 0.790223 15.3379 1.32227L1.38574 14.9258L1.2793 15.041C0.817171 15.5952 0.81717 16.4048 1.2793 16.959L1.38574 17.0742L15.3379 30.6777C15.884 31.2098 16.7343 31.243 17.3184 30.7773L17.4316 30.6777L19.6152 28.5479C20.2185 27.9596 20.2189 26.9903 19.6162 26.4014L9.33789 16.3574L9.27148 16.2783C9.15894 16.1106 9.15894 15.8894 9.27148 15.7217L9.33789 15.6426L19.6162 5.59863C20.2189 5.00974 20.2185 4.04041 19.6152 3.45215L17.4316 1.32227L17.3184 1.22266Z" fill="#3F9633" stroke="black"/>
            </svg>

          </button>
        </div>
      </main>

      <NavigationBar selected={2} />
    </div>
  );
}

export default Form3;
