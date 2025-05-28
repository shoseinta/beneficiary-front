import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../../components/navigationBar/NavigationBar";
import Header from "../../components/header/Header";
import bell_icon from '../../media/icons/bell_icon.svg';
import more_icon from '../../media/icons/more_icon.svg';
import tutorial from '../../media/images/tutorial.mp4';
import thumbnail from '../../media/images/thumbnail.png'
import './Home.css';

function Home() {
  const [endpointStates, setEndpointStates] = useState({
    "request-announcement-get": {
      id: "notif1",
      title: "اطلاعیه‌های شما",
      items: [],
      moreItems: [],
      page: 1,
      pageCount: 1,
      isLoading: false,
      loaded: false
    },
    "announcement-get": {
      id: "notif2",
      title: "اعلانات سامانه",
      items: [],
      moreItems: [],
      page: 1,
      pageCount: 1,
      isLoading: false,
      loaded: false
    }
  });

  // Contact information
  const contactInfo = {
    phone: "۰۲۱-۲۲۳۴۵۶۷۸",
    whatsapp: "۰۹۱۲۳۴۵۶۷۸۹",
    instagram: "daste_mehrabaan",
    email: "daste.mehrabaan@email.com",
    hours: "همه روزه از ساعت ۱۰ الی ۱۲"
  };

  const loadInitialData = async (endpoint) => {
    const currentState = endpointStates[endpoint];
    if (currentState.loaded) return;

    updateEndpointState(endpoint, { isLoading: true });
    
    try {
      const response = await fetch(
        `http://localhost:8000/beneficiary-platform/beneficiary/${
          localStorage.getItem('user_id')
        }/${endpoint}/?page=1`,
        {
          headers: {
            'Authorization': `Token ${localStorage.getItem('access_token')}`,
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
      
      if (data.results && data.results.length > 0) {
        const moreItems = data.results.map(item => ({
          heading: item.charity_announcement_for_request_title || "عنوان پیش‌فرض",
          date: item.charity_announcement_for_request_updated_at || "تاریخ نامشخص",
          content: item.charity_announcement_for_request_description || "محتوا موجود نیست"
        }));

        const items = moreItems.length > 0 ? [moreItems[0]] : [];
        
        updateEndpointState(endpoint, {
          items,
          moreItems,
          loaded: true,
          isLoading: false,
          pageCount: Math.max(Math.ceil(data.count / 10), 1)
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      updateEndpointState(endpoint, { 
        isLoading: false 
      });
    }
  };

  const updateEndpointState = (endpoint, updates) => {
    setEndpointStates(prev => ({
      ...prev,
      [endpoint]: {
        ...prev[endpoint],
        ...updates
      }
    }));
  };

  useEffect(() => {
    loadInitialData("request-announcement-get");
    loadInitialData("announcement-get");
  }, []);

  // Convert endpointStates to array for mapping
  const notifications = Object.values(endpointStates);

  return (
    <div className="container">
      <Header />
      <main className="main">
        <div className="carousel">
          {notifications.map((notification, index) => (
            <article key={notification.id} className="notification" id={notification.id}>
              <section className="h1">
                <img src={bell_icon} alt="" />
                <h1>{notification.title}</h1>
              </section>
              
              {notification.items && notification.items.map((item, itemIndex) => (
                <div key={itemIndex}>
                  <section className="h3">
                    <h3>{item.heading}</h3>
                    <time dateTime={item.date}>{item.date}</time>
                  </section>
                  <div>
                    <p className="paragraph">{item.content}</p>
                  </div>
                </div>
              ))}
              
              <div className="details">
                <details>
                  <summary className="summary">
                    موارد بیشتر <img src={more_icon} alt="" />
                  </summary>
                  <section className="h1">
                    <img src={bell_icon} alt="" />
                    <h1>{notification.title}</h1>
                  </section>
                  {notification.moreItems && notification.moreItems.map((item, moreIndex) => (
                    <div key={`more-${moreIndex}`}>
                      <section className="h3">
                        <h3>{item.heading}</h3>
                        <time dateTime={item.date}>{item.date}</time>
                      </section>
                      <div>
                        <p className="paragraph">{item.content}</p>
                      </div>
                    </div>
                  ))}
                </details>
              </div>
            </article>
          ))}
        </div>
        
        <div className="carousel-dots">
          {notifications.map((_, index) => (
            <span key={index} className={`dot ${index === 0 ? 'active' : ''}`}></span>
          ))}
        </div>
      </main>

      <section className="video">
        <div className="poster-overlay"></div>
        <video controls poster={thumbnail}>
          <source src={tutorial} type="video/mp4" />
          ویدئو آموزش استفاده از سامانه
        </video>
        <section className="title">ویدئو آموزش استفاده از سامانه</section>
      </section>

      <div className="footer-nav">
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
                {contactInfo.phone} <img src="media/icons/phone_icon.svg" alt="" />
              </a> <br />
              <a href={`https://wa.me/${contactInfo.whatsapp}`} target="_blank" rel="noopener noreferrer">
                {contactInfo.whatsapp} <img src="media/icons/whatsapp_icon.svg" alt="" />
              </a> <br />
              <a href={`https://instagram.com/${contactInfo.instagram}`} target="_blank" rel="noopener noreferrer">
                {contactInfo.instagram} <img src="media/icons/instagram_icon.svg" alt="" />
              </a> <br />
              <a href={`mailto:${contactInfo.email}`}>
                {contactInfo.email} <img src="media/icons/email_icon.svg" alt="" />
              </a> <br />
              <span>{contactInfo.hours}</span>
            </section>
          </footer>
        </div>
        <NavigationBar />
      </div>
    </div>
  );
}

export default Home;