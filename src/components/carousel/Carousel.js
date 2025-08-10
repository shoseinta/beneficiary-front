import { useEffect, useState, useRef, useMemo } from 'react';
import { toJalaali } from 'jalaali-js';


function Carousel({
  notification,
  notifIndex,
  endpointStates,
  setEndpointStates,
  whichNotif,
  setWhichNotif,
  moreItems,
  setMoreItems,
}) {
  const mainRef = useRef(null);
  const videoRef = useRef(null);
  const carouselRef = useRef(null);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      document.querySelector('.main').classList.remove('.slide-in-div')
      document.querySelector('.main').classList.remove('.slide-in-div-1')
    },500)
  },[])


  // Touch and mouse event handlers for swipe detection
  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleMouseDown = (e) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    
    // Only prevent default if we're actually swiping
    if (Math.abs(diff) > 5) {
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = startX - currentX;
    
    // Only prevent default if we're actually dragging
    if (Math.abs(diff) > 5) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e) => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    handleSwipe(endX);
    setIsDragging(false);
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    const endX = e.clientX;
    handleSwipe(endX);
    setIsDragging(false);
  };

  const handleSwipe = (endX) => {
    const threshold = 50; // Minimum swipe distance to trigger slide change
    const diff = startX - endX;

    if (diff > threshold) {
      // Swipe left - go to next slide
      if(whichNotif === 0){
        document.querySelector('.main').classList.add('slide-out-div')
      }else{
        document.querySelector('.main').classList.add('slide-out-div-1')
      }
      setTimeout(() => setWhichNotif(notifIndex === 0 ? 1 : 0),250)
    } else if (diff < -threshold) {
      // Swipe right - go to previous slide
      if(whichNotif === 0){
        document.querySelector('.main').classList.add('slide-out-div')
      }else{
        document.querySelector('.main').classList.add('slide-out-div-1')
      }
      setTimeout(() => setWhichNotif(notifIndex === 0 ? 1 : 0),250)
    }
  };

  // Add and remove event listeners
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    // Touch events
    carousel.addEventListener('touchstart', handleTouchStart, { passive: false });
    carousel.addEventListener('touchmove', handleTouchMove, { passive: false });
    carousel.addEventListener('touchend', handleTouchEnd);

    // Mouse events
    carousel.addEventListener('mousedown', handleMouseDown);
    carousel.addEventListener('mousemove', handleMouseMove);
    carousel.addEventListener('mouseup', handleMouseUp);
    carousel.addEventListener('mouseleave', () => setIsDragging(false));

    return () => {
      carousel.removeEventListener('touchstart', handleTouchStart);
      carousel.removeEventListener('touchmove', handleTouchMove);
      carousel.removeEventListener('touchend', handleTouchEnd);
      carousel.removeEventListener('mousedown', handleMouseDown);
      carousel.removeEventListener('mousemove', handleMouseMove);
      carousel.removeEventListener('mouseup', handleMouseUp);
      carousel.removeEventListener('mouseleave', () => setIsDragging(false));
    };
  }, [isDragging, startX]);


  useEffect(() => {
    console.log(moreItems);
  });

  useEffect(() => {
    if (!moreItems) {
      return;
    }
    let firstClick = false;
    const bodyOverlay = document.querySelector('body.more-active');
    const handleClick = (event) => {
      if (!firstClick) {
        firstClick = true;
        return;
      }
      const hasOverlayInPath = event.composedPath().some((element) => {
        return (
          element.classList &&
          element.classList.contains('notif-overlay-container')
        );
      });

      if (hasOverlayInPath) {
        return;
      }
      setMoreItems(false);
      document.body.classList.remove('more-active');
    };
    if (bodyOverlay) {
      bodyOverlay.addEventListener('click', handleClick);
    }
    return () => bodyOverlay.removeEventListener('click', handleClick);
  }, [moreItems]);
  const [carouselWidth,setCarouselWidth] = useState(0)
  useEffect(() => {
    if (!moreItems) {
      const mainEl = document.querySelector('.notif-box');
      const videoEl = document.querySelector('.video');

      if (mainEl && videoEl) {
        const top = mainEl.getBoundingClientRect().top + window.scrollY;
        const bottom = videoEl.getBoundingClientRect().bottom + window.scrollY;
        const height = bottom - top;
        const width = mainEl.getBoundingClientRect().width
        setCarouselWidth(width)

        document.documentElement.style.setProperty('--notif-top', `${top}px`);
        document.documentElement.style.setProperty(
          '--notif-height',
          `${height}px`
        );
      }
    }
  }, [moreItems]);

  const handleSeen = async (id) => {
    if (notifIndex === 0) {
      setEndpointStates((prev) => {
        return {
          ...prev,
          'request-announcement-get': {
            ...prev['request-announcement-get'],
            moreItems: prev['request-announcement-get'].moreItems.filter(
              (item) => {
                return item.id !== id;
              }
            ),
          },
        };
      });
      setEndpointStates((prev) => {
        return {
          ...prev,
          'request-announcement-get': {
            ...prev['request-announcement-get'],
            items: [prev['request-announcement-get'].moreItems[0]],
          },
        };
      });

      try {
        await fetch(
          `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem(
            'user_id'
          )}/request-announcement-seen/${id}/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem('access_token')}`,
              'Content-Type': 'application/json',
            },
          }
        );
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }

    if (notifIndex === 1) {
      setEndpointStates((prev) => {
        return {
          ...prev,
          'announcement-get': {
            ...prev['request-announcement-get'],
            moreItems: prev['announcement-get'].moreItems.filter((item) => {
              return item.id !== id;
            }),
          },
        };
      });
      setEndpointStates((prev) => {
        return {
          ...prev,
          'announcement-get': {
            ...prev['announcement-get'],
            items: [prev['announcement-get'].moreItems[0]],
          },
        };
      });

      try {
        await fetch(
          `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem(
            'user_id'
          )}/announcement-seen/${id}/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem('access_token')}`,
              'Content-Type': 'application/json',
            },
          }
        );
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }
  };
  // Function to convert Gregorian date to Persian digits
  const toPersianDigits = (num) => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().replace(/\d/g, (d) => persianDigits[d]);
  };

  // Function to convert Gregorian to Jalali date
  // Using jalaali-js library
  const gregorianToJalali = (dateString) => {
    if (!dateString) return 'تاریخ نامشخص';

    try {
      const [year, month, day] = dateString
        .split('T')[0]
        .split('-')
        .map(Number);
      const { jy, jm, jd } = toJalaali(year, month, day);
      return `${toPersianDigits(jy)}/${toPersianDigits(jm)}/${toPersianDigits(jd)}`;
    } catch (error) {
      console.error('Date conversion error:', error);
      return 'تاریخ نامشخص';
    }
  };

  // if (!notification || !notification.items || notification.items.length === 0) {
  //   return null;
  // }
const sortedItems = useMemo(() => {
  return [...(notification.items || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
}, [notification.items]);

const sortedMoreItems = useMemo(() => {
  return [...(notification.moreItems || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
}, [notification.moreItems]);
  return (
    <>
      <main
        className={whichNotif === 0?" notif-box slide-in-div-1" : " notif-box slide-in-div"}
        style={{ visibility: moreItems ? 'hidden' : 'visible' , rowGap:0}}
      >
        <div className="carousel-container" ref={carouselRef}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
          <div className="carousel">
            <article className="notification" id="notif1">
              {notification.moreItems.length !== 0 ? (
                <div className='notif-box-content'>
                  <section className="h1">
                    <svg width="12" height="15" viewBox="0 0 12 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.25" d="M5.84132 3.54157C4.05881 3.54157 2.97784 4.97491 2.97784 6.73465V10.9921H8.70479V6.73465C8.70479 4.97491 7.62383 3.54157 5.84132 3.54157Z" fill="#185EA0"/>
                    <path d="M5.8413 14.5396C6.62876 14.5396 7.27304 13.901 7.27304 13.1205H4.40956C4.40956 13.901 5.05384 14.5396 5.8413 14.5396ZM10.1365 10.2822V6.73435C10.1365 4.55596 8.96965 2.73236 6.9151 2.24985V1.76735C6.9151 1.1784 6.43547 0.702988 5.8413 0.702988C5.24713 0.702988 4.7675 1.1784 4.7675 1.76735V2.24985C2.72011 2.73236 1.54609 4.54887 1.54609 6.73435V10.2822L0.114349 11.7014V12.4109H11.5683V11.7014L10.1365 10.2822ZM8.70477 10.9918H2.97782V6.73435C2.97782 4.97461 4.05879 3.54128 5.8413 3.54128C7.62381 3.54128 8.70477 4.97461 8.70477 6.73435V10.9918Z" fill="#185EA0"/>
                  </svg>

                    <h1>
                      {notifIndex === 0 ? ' اطلاعیه‌های شما' : ' اعلانات سامانه'}
                    </h1>
                  </section>
                  <section className="h3">
                    <h3>{sortedMoreItems[0]?.heading || 'عنوان اطلاعیه'}</h3>
                    <time dateTime={sortedMoreItems[0]?.date || ''}>
                      {gregorianToJalali(sortedMoreItems[0]?.date) || 'تاریخ'}
                    </time>
                  </section>
                  <div>
                    <p className="paragraph" id="para1">
                      {sortedMoreItems[0]?.content || 'توضیحات اطلاعیه'}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <section className="h1" style={{ marginBottom: '0' }}>
                    <svg width="12" height="15" viewBox="0 0 12 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path opacity="0.25" d="M5.84132 3.54157C4.05881 3.54157 2.97784 4.97491 2.97784 6.73465V10.9921H8.70479V6.73465C8.70479 4.97491 7.62383 3.54157 5.84132 3.54157Z"/>
                  <path d="M5.8413 14.5396C6.62876 14.5396 7.27304 13.901 7.27304 13.1205H4.40956C4.40956 13.901 5.05384 14.5396 5.8413 14.5396ZM10.1365 10.2822V6.73435C10.1365 4.55596 8.96965 2.73236 6.9151 2.24985V1.76735C6.9151 1.1784 6.43547 0.702988 5.8413 0.702988C5.24713 0.702988 4.7675 1.1784 4.7675 1.76735V2.24985C2.72011 2.73236 1.54609 4.54887 1.54609 6.73435V10.2822L0.114349 11.7014V12.4109H11.5683V11.7014L10.1365 10.2822ZM8.70477 10.9918H2.97782V6.73435C2.97782 4.97461 4.05879 3.54128 5.8413 3.54128C7.62381 3.54128 8.70477 4.97461 8.70477 6.73435V10.9918Z"/>
                  </svg>

                    <h1>
                      {notifIndex === 0 ? ' اطلاعیه‌های شما' : ' اعلانات سامانه'}
                    </h1>
                  </section>
                  <div style={{ height: '100%' }}>
                    <section
                      className="h3"
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '50%',
                        position: 'relative',
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                    >
                      <h3>{'موردی وجود ندارد'}</h3>
                      {/* <time dateTime={sortedMoreItems[0]?.date || ""}>
                
                </time> */}
                    </section>

                    <div>
                      <p className="paragraph" id="para1"></p>
                    </div>
                  </div>
                </>
              )}
              {notification.items.length !== 0 && (
                <div
                  className="details"
                  onClick={() => {
                    setMoreItems(true);
                    document.body.classList.add('more-active');
                  }}
                >
                  <details>
                    <summary className="summary">
                      {' '}
                      موارد بیشتر 
                    <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.25" d="M2.99457 0.841187L1.01795 3.78424L2.99881 6.72729H9.33162V0.841187H2.99457C2.99881 0.841187 2.99881 0.841187 2.99457 0.841187ZM8.05912 3.15358C8.41118 3.15358 8.69537 3.43528 8.69537 3.78424C8.69537 4.1332 8.41118 4.41489 8.05912 4.41489C7.70706 4.41489 7.42287 4.1332 7.42287 3.78424C7.42287 3.43528 7.70706 3.15358 8.05912 3.15358ZM5.93829 3.15358C6.29034 3.15358 6.57454 3.43528 6.57454 3.78424C6.57454 4.1332 6.29034 4.41489 5.93829 4.41489C5.58623 4.41489 5.30204 4.1332 5.30204 3.78424C5.30204 3.43528 5.58623 3.15358 5.93829 3.15358ZM3.81745 3.15358C4.16951 3.15358 4.4537 3.43528 4.4537 3.78424C4.4537 4.1332 4.16951 4.41489 3.81745 4.41489C3.46539 4.41489 3.1812 4.1332 3.1812 3.78424C3.1812 3.43528 3.46539 3.15358 3.81745 3.15358Z" fill="#185EA0"/>
                    <path d="M9.33167 0H2.96917C2.67649 0 2.44744 0.147153 2.29474 0.369983L0 3.78392L2.29474 7.19366C2.44744 7.41649 2.70618 7.56784 2.99886 7.56784H9.33167C9.79825 7.56784 10.18 7.18945 10.18 6.72697V0.840871C10.18 0.378392 9.79825 0 9.33167 0ZM9.33167 6.72697H2.99886L1.018 3.78392L2.99462 0.840871H9.33167V6.72697Z" fill="#185EA0"/>
                    <path d="M3.81749 4.41478C4.16889 4.41478 4.45374 4.13243 4.45374 3.78413C4.45374 3.43583 4.16889 3.15347 3.81749 3.15347C3.4661 3.15347 3.18124 3.43583 3.18124 3.78413C3.18124 4.13243 3.4661 4.41478 3.81749 4.41478Z" fill="#185EA0"/>
                    <path d="M5.9383 4.41478C6.28969 4.41478 6.57455 4.13243 6.57455 3.78413C6.57455 3.43583 6.28969 3.15347 5.9383 3.15347C5.58691 3.15347 5.30205 3.43583 5.30205 3.78413C5.30205 4.13243 5.58691 4.41478 5.9383 4.41478Z" fill="#185EA0"/>
                    <path d="M8.05921 4.41478C8.4106 4.41478 8.69546 4.13243 8.69546 3.78413C8.69546 3.43583 8.4106 3.15347 8.05921 3.15347C7.70782 3.15347 7.42296 3.43583 7.42296 3.78413C7.42296 4.13243 7.70782 4.41478 8.05921 4.41478Z" fill="#185EA0"/>
                    </svg>
                    {' '}
                    </summary>
                  </details>
                </div>
              )}
            </article>
          </div>
        </div>
        <div className="carousel-dots">
          {notifIndex === 0 ? (
            <span className="dot active"></span>
          ) : (
            <span className="dot" onClick={() => {
              if(whichNotif === 0){
              setWhichNotif(0)
              } else {
                document.querySelector('.main').classList.add('slide-out-div-1')
                setTimeout(() => setWhichNotif(0),250)
              }
            }}></span>
          )}
          {notifIndex === 1 ? (
            <span className="dot active"></span>
          ) : (
            <span className="dot" onClick={() => {
              if (whichNotif === 1){
              setWhichNotif(1)
              } else {
                document.querySelector('.main').classList.add('slide-out-div')
                setTimeout(() => setWhichNotif(1),250)
              }
            }}></span>
          )}
        </div>
      </main>

      {moreItems && (
        <div className="notif-overlay-container" style={{width:carouselWidth}}>
          <div className="notif-overlay-up">
            <section className="notif-overlay-header">
              <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.25" d="M5.84132 3.54157C4.05881 3.54157 2.97784 4.97491 2.97784 6.73465V10.9921H8.70479V6.73465C8.70479 4.97491 7.62383 3.54157 5.84132 3.54157Z" fill="#185EA0"/>
              <path d="M5.8413 14.5396C6.62876 14.5396 7.27304 13.901 7.27304 13.1205H4.40956C4.40956 13.901 5.05384 14.5396 5.8413 14.5396ZM10.1365 10.2822V6.73435C10.1365 4.55596 8.96965 2.73236 6.9151 2.24985V1.76735C6.9151 1.1784 6.43547 0.702988 5.8413 0.702988C5.24713 0.702988 4.7675 1.1784 4.7675 1.76735V2.24985C2.72011 2.73236 1.54609 4.54887 1.54609 6.73435V10.2822L0.114349 11.7014V12.4109H11.5683V11.7014L10.1365 10.2822ZM8.70477 10.9918H2.97782V6.73435C2.97782 4.97461 4.05879 3.54128 5.8413 3.54128C7.62381 3.54128 8.70477 4.97461 8.70477 6.73435V10.9918Z" fill="#185EA0"/>
              </svg>

              <h1> اطلاعیه‌های شما </h1>
            </section>

            <button
              onClick={() => {
                setMoreItems(false);
                document.body.classList.remove('more-active');
              }}
            >
              <span> بستن </span>
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M29.2929 3.72853C29.6834 3.33801 29.6834 2.70485 29.2929 2.31432L27.6857 0.707107C27.2952 0.316583 26.662 0.316583 26.2715 0.707107L15.7071 11.2715C15.3166 11.662 14.6834 11.662 14.2929 11.2715L3.72853 0.707106C3.33801 0.316582 2.70485 0.316582 2.31432 0.707107L0.707107 2.31432C0.316583 2.70485 0.316583 3.33801 0.707107 3.72853L11.2715 14.2929C11.662 14.6834 11.662 15.3166 11.2715 15.7071L0.707106 26.2715C0.316582 26.662 0.316582 27.2952 0.707107 27.6857L2.31432 29.2929C2.70485 29.6834 3.33801 29.6834 3.72853 29.2929L14.2929 18.7285C14.6834 18.338 15.3166 18.338 15.7071 18.7285L26.2715 29.2929C26.662 29.6834 27.2952 29.6834 27.6857 29.2929L29.2929 27.6857C29.6834 27.2952 29.6834 26.662 29.2929 26.2715L18.7285 15.7071C18.338 15.3166 18.338 14.6834 18.7285 14.2929L29.2929 3.72853Z" />
              </svg>
            </button>
          </div>

          {sortedMoreItems.map((item) => {
            return (
              <div className="notif-overlay-body">
                <section className="notif-overlay-title">
                  <h3>{item?.heading || 'empty'}</h3>
                  <time dateTime="۰۴/۳/۲۵">
                    {' '}
                    {gregorianToJalali(item?.date || null)}{' '}
                  </time>
                </section>

                <div className="notif-overlay-content">
                  <p>{item?.content || 'empty'}</p>
                  <button onClick={() => handleSeen(item.id)}>
                    <span> نمایش نده </span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7 8.75003C7.46414 8.75003 7.90927 8.56565 8.23746 8.23746C8.56565 7.90927 8.75003 7.46414 8.75003 7C8.75003 6.84425 8.72378 6.69549 8.68528 6.55199L13.7438 1.49352C13.9078 1.32945 14 1.10692 14 0.874884C14 0.642851 13.9078 0.42032 13.7438 0.256248C13.5797 0.0921751 13.3571 0 13.1251 0C12.8931 0 12.6706 0.0921751 12.5065 0.256248L10.2227 2.54004C9.23037 2.0141 8.12306 1.74261 7 1.7499C2.08941 1.7499 0.142496 6.47412 0.0619942 6.67449C-0.020231 6.88371 -0.020231 7.11629 0.0619942 7.32551C0.109245 7.44188 0.792633 9.08516 2.32129 10.4414L0.256248 12.5065C0.175007 12.5877 0.110564 12.6842 0.0665968 12.7903C0.0226297 12.8965 8.56009e-10 13.0102 0 13.1251C-8.56008e-10 13.24 0.0226297 13.3538 0.0665968 13.4599C0.110564 13.5661 0.175007 13.6625 0.256248 13.7438C0.337488 13.825 0.433935 13.8894 0.540081 13.9334C0.646227 13.9774 0.759993 14 0.874884 14C0.989776 14 1.10354 13.9774 1.20969 13.9334C1.31583 13.8894 1.41228 13.825 1.49352 13.7438L6.55199 8.68528C6.69549 8.72291 6.84425 8.75003 7 8.75003ZM3.49993 7C3.49993 6.07172 3.86869 5.18147 4.52508 4.52508C5.18147 3.86869 6.07172 3.49993 7 3.49993C7.64926 3.49993 8.25302 3.68194 8.77191 3.99082L7.44801 5.31472C7.3021 5.27387 7.15151 5.2521 7 5.24997C6.53586 5.24997 6.09074 5.43435 5.76254 5.76254C5.43435 6.09074 5.24997 6.53586 5.24997 7C5.24997 7.15575 5.27709 7.30363 5.31472 7.44713L3.99082 8.77191C3.67057 8.23627 3.50097 7.62407 3.49993 7ZM12.377 4.24895L10.4064 6.21949C10.4624 6.47149 10.4992 6.73137 10.4992 7.00088C10.4992 7.92915 10.1304 8.81941 9.47405 9.4758C8.81766 10.1322 7.9274 10.5009 6.99913 10.5009C6.73137 10.5009 6.47237 10.4642 6.22036 10.4064L4.74858 11.8765C5.47318 12.1248 6.23401 12.2511 7 12.2501C11.9115 12.2501 13.8575 7.52589 13.9371 7.32463C14.02 7.11615 14.02 6.88385 13.9371 6.67537C13.8986 6.57824 13.4156 5.41797 12.3761 4.24895H12.377Z" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default Carousel;
