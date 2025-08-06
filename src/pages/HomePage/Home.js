import { useEffect, useState, useRef } from 'react';
import Carousel from '../../components/carousel/Carousel';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../components/navigationBar/NavigationBar';
import Header from '../../components/header/Header';
import bell_icon from '../../media/icons/bell_icon.svg';
import more_icon from '../../media/icons/more_icon.svg';
import tutorial from '../../media/images/tutorial.mp4';
import thumbnail from '../../media/images/thumbnail.png';
import phone_icon from '../../media/icons/phone_icon.svg';
import whatsapp_icon from '../../media/icons/whatsapp_icon.svg';
import instagram_icon from '../../media/icons/instagram_icon.svg';
import email_icon from '../../media/icons/email_icon.svg';
import './Home.css';
import useEmblaCarousel from 'embla-carousel-react';

function Home() {
  const [carousel1Display, setCarousel1Display] = useState(true)
  const [carousel2Display, setCarousel2Display] = useState(false)
  const [whichNotif, setWhichNotif] = useState(0);
  useEffect(() => {
    if(whichNotif === 0) {
      setCarousel1Display(true)
      setCarousel2Display(false)
    } else {
      setCarousel1Display(false)
      setCarousel2Display(true)
    }
  },[whichNotif])
  const [moreItems, setMoreItems] = useState(false);
  const [emblaRef] = useEmblaCarousel();
  const [endpointStates, setEndpointStates] = useState({
    'request-announcement-get': {
      id: 'notif1',
      title: 'اطلاعیه‌های شما',
      items: [],
      moreItems: [],
      page: 1,
      pageCount: 1,
      isLoading: false,
      loaded: false,
    },
    'announcement-get': {
      id: 'notif2',
      title: 'اعلانات سامانه',
      items: [],
      moreItems: [],
      page: 1,
      pageCount: 1,
      isLoading: false,
      loaded: false,
    },
  });

  useEffect(() => {
    document.title = 'صفحه خانه خیریه';
  }, []);

  

  // Contact information
  const contactInfo = {
    phone: '۰۲۱-۲۲۳۴۵۶۷۸',
    whatsapp: '۰۹۱۲۳۴۵۶۷۸۹',
    instagram: 'daste_mehrabaan',
    email: 'daste.mehrabaan@email.com',
    hours: 'همه روزه از ساعت ۱۰ الی ۱۲',
  };

  const loadInitialData = async (endpoint) => {
    const currentState = endpointStates[endpoint];
    if (currentState.loaded) return;

    updateEndpointState(endpoint, { isLoading: true });

    try {
      const response = await fetch(
        `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem(
          'user_id'
        )}/${endpoint}/?page=1`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem('access_token');
        window.location.reload();
        return;
      }

      const data = await response.json();
      let moreItems;

      if (data.results && data.results.length > 0) {
        if (endpoint === 'request-announcement-get') {
          moreItems = data.results.map((item) => ({
            id: item.charity_announcement_for_request_id || 0,
            heading:
              item.charity_announcement_for_request_title || 'عنوان پیش‌فرض',
            date:
              item.charity_announcement_for_request_updated_at ||
              'تاریخ نامشخص',
            content:
              item.charity_announcement_for_request_description ||
              'محتوا موجود نیست',
          }));
        }
        if (endpoint === 'announcement-get') {
          moreItems = data.results.map((item) => ({
            id: item.charity_announcement_to_beneficiary_id || 0,
            heading:
              item.charity_announcement_to_beneficiary_title || 'عنوان پیش‌فرض',
            date:
              item.charity_announcement_to_beneficiary_updated_at ||
              'تاریخ نامشخص',
            content:
              item.charity_announcement_to_beneficiary_description ||
              'محتوا موجود نیست',
          }));
        }

        const items = moreItems.length > 0 ? [moreItems[0]] : [];

        updateEndpointState(endpoint, {
          items,
          moreItems,
          loaded: true,
          isLoading: false,
          pageCount: Math.max(Math.ceil(data.count / 10), 1),
        });
      }
    } catch (error) {
      console.error('Fetch error:', error);
      updateEndpointState(endpoint, {
        isLoading: false,
      });
    }
  };

  const updateEndpointState = (endpoint, updates) => {
    setEndpointStates((prev) => ({
      ...prev,
      [endpoint]: {
        ...prev[endpoint],
        ...updates,
      },
    }));
  };

  useEffect(() => {
    loadInitialData('request-announcement-get');
    loadInitialData('announcement-get');
  }, []);

  // Convert endpointStates to array for mapping
  const notifications = Object.values(endpointStates);

  useEffect(() => console.log(notifications));

  useEffect(() => {
    document.documentElement.classList.add('home-html');
    document.body.classList.add('home-body');

    return () => {
      document.documentElement.classList.remove('home-html');
      document.body.classList.remove('home-body');
    };
  }, []);

  useEffect(() => {
    if(moreItems) {
      document.querySelector('.home-body').style.overflow = 'hidden';
    }else {
      document.querySelector('.home-body').style.overflow = 'auto';
    }
  },[moreItems])

  return (
    <>
    <div className="home-container">
      <Header />
      {/* <Carousel notifications={notifications} endpointStates={endpointStates}/> */}

      {/* {whichNotif === 0 && (
        <Carousel
          notification={notifications[0]}
          notifIndex={0}
          endpointStates={endpointStates}
          setEndpointStates={setEndpointStates}
          setWhichNotif={setWhichNotif}
          moreItems={moreItems}
          setMoreItems={setMoreItems}
        />
      )}
      {whichNotif === 1 && (
        <Carousel
          notification={notifications[1]}
          notifIndex={1}
          endpointStates={endpointStates}
          setEndpointStates={setEndpointStates}
          setWhichNotif={setWhichNotif}
          moreItems={moreItems}
          setMoreItems={setMoreItems}
        />
      )} */}
      <div className='main'>
      <div className='notif-container'>
        {carousel1Display && <Carousel
          notification={notifications[0]}
          notifIndex={0}
          endpointStates={endpointStates}
          setEndpointStates={setEndpointStates}
          whichNotif={whichNotif}
          setWhichNotif={setWhichNotif}
          moreItems={moreItems}
          setMoreItems={setMoreItems}
          display={carousel1Display}
        />}
        {carousel2Display && <Carousel
          notification={notifications[1]}
          notifIndex={1}
          endpointStates={endpointStates}
          setEndpointStates={setEndpointStates}
          whichNotif={whichNotif}
          setWhichNotif={setWhichNotif}
          moreItems={moreItems}
          setMoreItems={setMoreItems}
          display={carousel2Display}
        />}
      </div>
      <section className="video">
        <div className="poster-overlay"></div>
        <video controls poster={'../../media/images/nothing.png'}>
          <source src={tutorial} type="video/mp4" />
          ویدئو آموزش استفاده از سامانه
        </video>
        <section className="title">ویدئو آموزش استفاده از سامانه</section>
      </section>

              <div className="footer-container">
          <footer className="footer">
            <h2 id="title">ارتباط با خیریه</h2>
            <section id="key">
              شماره تماس <br />
              شماره واتس‌اپ <br />
              صفحه اینستاگرام <br />
              آدرس ایمیل <br />
              ساعات پاسخگویی
            </section>
            <section id="value">
              <a href={`tel:${contactInfo.phone}`}>
                {contactInfo.phone}{' '}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.4444 7C12.4444 5.48333 11.9161 4.19663 10.8593 3.13989C9.80311 2.08367 8.51667 1.55556 7 1.55556V0C7.97222 0 8.883 0.184593 9.73233 0.553778C10.5811 0.923481 11.32 1.42256 11.949 2.051C12.5774 2.67996 13.0765 3.41885 13.4462 4.26767C13.8154 5.117 14 6.02778 14 7H12.4444ZM9.33333 7C9.33333 6.35185 9.10648 5.80093 8.65278 5.34722C8.19907 4.89352 7.64815 4.66667 7 4.66667V3.11111C8.07593 3.11111 8.99319 3.49015 9.75178 4.24822C10.5099 5.00681 10.8889 5.92407 10.8889 7H9.33333ZM13.1833 14C11.5111 14 9.88115 13.6272 8.29344 12.8816C6.70522 12.1364 5.29874 11.1513 4.074 9.926C2.84874 8.70126 1.86356 7.29478 1.11844 5.70656C0.372815 4.11885 0 2.48889 0 0.816667C0 0.583333 0.0777777 0.388889 0.233333 0.233333C0.388889 0.0777777 0.583333 0 0.816667 0H3.96667C4.14815 0 4.31019 0.0583333 4.45278 0.175C4.59537 0.291667 4.67963 0.440741 4.70556 0.622222L5.21111 3.34444C5.23704 3.52593 5.23393 3.69107 5.20178 3.83989C5.16911 3.98922 5.09444 4.12222 4.97778 4.23889L3.11111 6.14444C3.65556 7.07778 4.33611 7.95278 5.15278 8.76944C5.96944 9.58611 6.87037 10.2926 7.85556 10.8889L9.68333 9.06111C9.8 8.94444 9.95245 8.85682 10.1407 8.79822C10.3284 8.74015 10.513 8.72407 10.6944 8.75L13.3778 9.29444C13.5593 9.33333 13.7083 9.4207 13.825 9.55656C13.9417 9.69293 14 9.85185 14 10.0333V13.1833C14 13.4167 13.9222 13.6111 13.7667 13.7667C13.6111 13.9222 13.4167 14 13.1833 14ZM2.37222 4.66667L3.65556 3.38333L3.30556 1.55556H1.59444C1.65926 2.08704 1.75 2.61204 1.86667 3.13056C1.98333 3.64907 2.15185 4.16111 2.37222 4.66667ZM12.4444 12.4056V10.6944L10.6167 10.3056L9.33333 11.5889C9.83889 11.8093 10.3509 11.9907 10.8694 12.1333C11.388 12.2759 11.913 12.3667 12.4444 12.4056Z" fill="black"/>
                </svg>

              </a>{' '}
              <br />
              <a
                href={`https://wa.me/${contactInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {contactInfo.whatsapp}{' '}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.9598 2.037C10.6442 0.721 8.89246 0 7.02814 0C3.18693 0 0.0562815 3.115 0.0562815 6.937C0.0562815 8.162 0.3799 9.352 0.984925 10.402L0 14L3.69347 13.034C4.71357 13.587 5.8603 13.881 7.02814 13.881C10.8693 13.881 14 10.766 14 6.944C14 5.089 13.2754 3.346 11.9598 2.037ZM7.02814 12.705C5.98693 12.705 4.96683 12.425 4.07337 11.9L3.86231 11.774L1.66734 12.348L2.25126 10.22L2.11055 10.003C1.53367 9.086 1.22412 8.022 1.22412 6.937C1.22412 3.759 3.82714 1.169 7.0211 1.169C8.56884 1.169 10.0251 1.771 11.1156 2.863C12.2131 3.955 12.8111 5.404 12.8111 6.944C12.8251 10.122 10.2221 12.705 7.02814 12.705ZM10.208 8.393C10.0322 8.309 9.17387 7.889 9.01909 7.826C8.85729 7.77 8.74472 7.742 8.62512 7.91C8.50553 8.085 8.17487 8.477 8.07638 8.589C7.97789 8.708 7.87236 8.722 7.69648 8.631C7.5206 8.547 6.95779 8.358 6.29648 7.77C5.77588 7.308 5.43116 6.741 5.32563 6.566C5.22714 6.391 5.31156 6.3 5.40301 6.209C5.4804 6.132 5.57889 6.006 5.66332 5.908C5.74774 5.81 5.78291 5.733 5.8392 5.621C5.89548 5.502 5.86734 5.404 5.82513 5.32C5.78291 5.236 5.43116 4.382 5.29045 4.032C5.14975 3.696 5.00201 3.738 4.89648 3.731C4.79095 3.731 4.67839 3.731 4.55879 3.731C4.4392 3.731 4.25628 3.773 4.09447 3.948C3.9397 4.123 3.48945 4.543 3.48945 5.397C3.48945 6.251 4.11558 7.077 4.2 7.189C4.28442 7.308 5.43116 9.058 7.17588 9.807C7.59095 9.989 7.91457 10.094 8.16784 10.171C8.58291 10.304 8.96281 10.283 9.26533 10.241C9.60301 10.192 10.2995 9.821 10.4402 9.415C10.5879 9.009 10.5879 8.666 10.5387 8.589C10.4894 8.512 10.3839 8.477 10.208 8.393Z" fill="black"/>
                </svg>

              </a>{' '}
              <br />
              <a
                href={`https://instagram.com/${contactInfo.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {contactInfo.instagram}{' '}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.88889 0C1.74456 0 0 1.74456 0 3.88889V10.1111C0 12.2554 1.74456 14 3.88889 14H10.1111C12.2554 14 14 12.2554 14 10.1111V3.88889C14 1.74456 12.2554 0 10.1111 0H3.88889ZM3.88889 1.55556H10.1111C11.3976 1.55556 12.4444 2.60244 12.4444 3.88889V10.1111C12.4444 11.3976 11.3976 12.4444 10.1111 12.4444H3.88889C2.60244 12.4444 1.55556 11.3976 1.55556 10.1111V3.88889C1.55556 2.60244 2.60244 1.55556 3.88889 1.55556ZM10.8889 2.33333C10.6826 2.33333 10.4848 2.41528 10.3389 2.56114C10.1931 2.707 10.1111 2.90483 10.1111 3.11111C10.1111 3.31739 10.1931 3.51522 10.3389 3.66108C10.4848 3.80694 10.6826 3.88889 10.8889 3.88889C11.0952 3.88889 11.293 3.80694 11.4389 3.66108C11.5847 3.51522 11.6667 3.31739 11.6667 3.11111C11.6667 2.90483 11.5847 2.707 11.4389 2.56114C11.293 2.41528 11.0952 2.33333 10.8889 2.33333ZM7 3.11111C4.85567 3.11111 3.11111 4.85567 3.11111 7C3.11111 9.14433 4.85567 10.8889 7 10.8889C9.14433 10.8889 10.8889 9.14433 10.8889 7C10.8889 4.85567 9.14433 3.11111 7 3.11111ZM7 4.66667C8.28644 4.66667 9.33333 5.71356 9.33333 7C9.33333 8.28644 8.28644 9.33333 7 9.33333C5.71356 9.33333 4.66667 8.28644 4.66667 7C4.66667 5.71356 5.71356 4.66667 7 4.66667Z" fill="black"/>
                </svg>

              </a>{' '}
              <br />
              <a href={`mailto:${contactInfo.email}`}>
                {contactInfo.email}{' '}
                <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 1.375C14 0.61875 13.37 0 12.6 0H1.4C0.63 0 0 0.61875 0 1.375V9.625C0 10.3813 0.63 11 1.4 11H12.6C13.37 11 14 10.3813 14 9.625V1.375ZM12.6 1.375L7 4.8125L1.4 1.375H12.6ZM12.6 9.625H1.4V2.75L7 6.1875L12.6 2.75V9.625Z" fill="black"/>
                </svg>

              </a>{' '}
              <br />
              <span>{contactInfo.hours}</span>
            </section>
          </footer>
        </div>
</div>
      <div className="footer-nav">
        <NavigationBar selected={1} />
      </div>
    </div>
    {
      moreItems && (
        <div className='block-overlay-container' style={{overflow:"hidden"}}></div>
      )
    }
    </>
  );
}

export default Home;
