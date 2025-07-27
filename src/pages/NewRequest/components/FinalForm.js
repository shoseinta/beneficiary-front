import { useEffect } from 'react';
import './FinalForm.css';

function FinalForm() {
  useEffect(() => {
    document.body.classList.add('final-form-body');
    document.documentElement.classList.add('final-form-body');
    document.getElementById('root').classList.add('final-form');

    return () => {
      document.body.classList.remove('final-form-body');
      document.documentElement.classList.remove('final-form-body');
      document.getElementById('root').classList.remove('final-form');
    };
  }, []);

  return (
    <div className="final-form">
      <svg
        width="59"
        height="59"
        viewBox="0 0 59 59"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M26.25 42L12.5417 28.2917L16.625 24.2083L26.25 33.8333L50.75 9.33333C45.2083 3.79167 37.625 0 29.1667 0C13.125 0 0 13.125 0 29.1667C0 45.2083 13.125 58.3333 29.1667 58.3333C45.2083 58.3333 58.3333 45.2083 58.3333 29.1667C58.3333 23.625 56.875 18.6667 54.25 14.2917L26.25 42Z" />
      </svg>

      <h1>درخواست شما با موفقیت ثبت گردید.</h1>

      <p>تا لحظاتی دیگر به صفحه سوابق درخواست منتقل می‌شوید.</p>
    </div>
  );
}

export default FinalForm;
