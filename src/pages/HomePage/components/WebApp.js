import lottie from 'lottie-web';
import charity_logo from '../../../media/images/charity_logo.png'
import charity_typo_blue from '../../../media/images/charity_typo_blue.png'
import { useEffect, useState } from "react";
import './WebApp.css';

function WebApp({isInstalled,setIsInstalled}) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Check if app is already installed
  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    setIsInstalled(isStandalone);
  }, []);

  // Capture install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Lottie animation
  useEffect(() => {
    const container = document.getElementById('lottie-hand');
    if (!container) return;

    container.innerHTML = '';

    const animation = lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/lottie_hand.json',
    });

    animation.addEventListener('DOMLoaded', () => {
      const elements = container.querySelectorAll('svg path');
      elements.forEach(el => {
        el.setAttribute('fill', '#8BAECF');
      });
    });

    return () => animation.destroy();
  }, []);

  // HTML class setup
  useEffect(() => {
    document.documentElement.classList.add('html-webapp');
    document.body.classList.add('html-webapp');

    return () => {
      document.documentElement.classList.remove('html-webapp');
      document.body.classList.remove('html-webapp');
    };
  }, []);

  // Handle install click
  const handleInstallClick = () => {
    if (isInstalled) {
      alert("برنامه قبلاً نصب شده است. لطفاً آن را از صفحه اصلی دستگاه خود باز کنید.");
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(choice => {
        if (choice.outcome === 'accepted') {
          console.log("User accepted the install prompt");
          setIsInstalled(true)
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null);
      });
    } else {
      alert("نصب برنامه در حال حاضر پشتیبانی نمی‌شود یا مرورگر شما از این قابلیت پشتیبانی نمی‌کند.");
    }
  };

  return (
    <div className="webapp-container">
      <div className="logo-typo">
        <img src={charity_logo} alt="لوگوی خیریه دست مهربان" id="logo" />
        <img src={charity_typo_blue} alt="تایپوگرافی نام خیریه دست مهربان" id="typo" />
      </div>

      <div className="main-container">
        <div style={{ position: "relative", display: "inline-block" }}>
          <button onClick={handleInstallClick}>
            برای دریافت برنامه اینجا را کلیک کنید
          </button>
          <div className="lottie-hand" id="lottie-hand"></div>
        </div>
      </div>

      <div className="empty"></div>
    </div>
  );
}

export default WebApp;