import Header from '../../../components/header/Header';
import NavigationBar from '../../../components/navigationBar/NavigationBar';
import { useState, useEffect, useRef, use } from 'react';
import './Account3.css';
import { useLookup } from '../../../context/LookUpContext';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';
import 'leaflet.locatecontrol';
import LocateControl from '../../../components/locateControl/LocateControl';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import LoadingButton from '../../../components/loadingButton/LoadingButton';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function LocationMarker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>موقعیت انتخاب شده</Popup>
    </Marker>
  );
}

function Account3({
  accountData,
  setAccountData,
  setStep,
  setLoad,
  hasAddress,
}) {
  useEffect(() => {
    const topLeft = document.querySelector('.leaflet-top.leaflet-left')
    if (topLeft){
      topLeft.parentElement.removeChild(topLeft)
    }
    const bottomRight = document.querySelector('.leaflet-bottom.leaflet-right')
    if(bottomRight){
      bottomRight.parentElement.removeChild(bottomRight)
    }
  })
  
  const [userLocation, setUserLocation] = useState(null);
  const [useUserLocation, setUseUserLocation] = useState(false);
  const [addressWidth, setAddressWidth] = useState(0);
  const [mapWidth, setMapWidth] = useState(0);
useEffect(() => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.warn("Geolocation error:", error.message);
        // Optional: set a fallback state or show a message
      }
    );
  } else {
    console.warn("Geolocation not supported");
  }
}, []);
useEffect(() => {
console.log(userLocation)
})
  
  const [isLoadingButtonAddress, setIsLoadingButtonAddress] = useState(false)
  const [isLoadingButtonMap, setIsLoadingButtonMap] = useState(false)
  useEffect(() => {
    const inputElement = document.querySelector('.address-submit');
    if(!inputElement) return;
    else {
      const rect = inputElement.getBoundingClientRect();
      const rightX = rect.right;
      const leftX = rect.left;
      setAddressWidth(rightX - leftX);
    }
  },[isLoadingButtonAddress]);
    useEffect(() => {
    const inputElement = document.querySelector('.map-submit');
    if(!inputElement) return;
    else {
      const rect = inputElement.getBoundingClientRect();
      setMapWidth(rect.width);
    }
  },[isLoadingButtonMap]);
  const toPersianDigits = (num) => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().replace(/\d/g, (x) => persianDigits[x]);
  };
  const [account1Data, setAccount1Data] = useState(accountData);
  const { provinces, cities } = useLookup();
  const [submit, setSubmit] = useState(false);
  const [submitMap, setSubmitMap] = useState(false);
  useEffect(() => {
    setAccount1Data(accountData);
  }, [accountData]);

  useEffect(() => {
    if (account1Data?.beneficiary_user_address?.province === 0) {
      setAccount1Data((pre) => ({
        ...pre,
        beneficiary_user_address: {
          ...pre.beneficiary_user_address,
          province: null,
        },
      }));
    }
  }, [account1Data]);
  const [validation, setValidation] = useState({
    neighbor: true,
    street: true,
    alley: true,
    postal_code: true,
  });

  const [blur, setBlur] = useState({
    neighbor: true,
    street: true,
    alley: true,
    postal_code: true,
  });

  // Initialize position state with proper fallbacks
  const [position, setPosition] = useState([35.6892, 51.389])

  useEffect(() => {
  const backendLat = account1Data?.beneficiary_user_address?.latitude;
  const backendLng = account1Data?.beneficiary_user_address?.longitude;

  if (backendLat && backendLng) {
    setPosition([backendLat, backendLng]);
  } else if (userLocation) {
    setPosition(userLocation);
  }
}, [userLocation, account1Data]);



  // Ref for map div and useEffect to set height = width
  const mapRef = useRef();
 
  const isPersian = (text) => {
    const persianRegex = /^[\u0600-\u06FF\u0621-\u064A\s]+$/;
    return persianRegex.test(text);
  };

  const isDigit = (text) => {
    const digitRegex = /^[\u06F0-\u06F90-9]+$/;
    return digitRegex.test(text);
  };

  const handlePostalCodeChange = (event) => {
    setBlur((pre) => ({ ...pre, postal_code: false }));
    // Convert Persian digits to English and remove all non-digit characters
    let englishValue = event.target.value
      .split('')
      .map((c) => {
        const persianDigits = [
          '۰',
          '۱',
          '۲',
          '۳',
          '۴',
          '۵',
          '۶',
          '۷',
          '۸',
          '۹',
        ];
        const index = persianDigits.indexOf(c);
        return index >= 0 ? index.toString() : c;
      })
      .join('')
      .replace(/\D/g, '');

    // Update the state with the English number (or empty string)
    const newValue = englishValue === '' ? null : englishValue;
    setAccount1Data((pre) => ({
      ...pre,
      beneficiary_user_address: {
        ...pre.beneficiary_user_address,
        postal_code: newValue,
      },
    }));
    if (newValue !== null && newValue.length !== 10 ) {
      setValidation((pre) => ({ ...pre, postal_code: false }));
    } else {
      setValidation((pre) => ({ ...pre, postal_code: true }));
    }

    // Update the displayed value with Persian digits (no commas)
    const displayValue =
      englishValue === '' ? '' : toPersianDigits(englishValue);
    event.target.value = displayValue;
  };

  const handleUnitChange = (event) => {
    // Convert Persian digits to English and remove all non-digit characters
    let englishValue = event.target.value
      .split('')
      .map((c) => {
        const persianDigits = [
          '۰',
          '۱',
          '۲',
          '۳',
          '۴',
          '۵',
          '۶',
          '۷',
          '۸',
          '۹',
        ];
        const index = persianDigits.indexOf(c);
        return index >= 0 ? index.toString() : c;
      })
      .join('')
      .replace(/\D/g, '');

    // Update the state with the English number (or empty string)
    const newValue = englishValue === '' ? null : Number(englishValue);
    setAccount1Data((pre) => ({
      ...pre,
      beneficiary_user_address: {
        ...pre.beneficiary_user_address,
        unit: newValue,
      },
    }));
    // Update the displayed value with Persian digits (no commas)
    const displayValue =
      englishValue === '' ? '' : toPersianDigits(englishValue);
    event.target.value = displayValue;
  };
  const handleBuildingNumberChange = (event) => {
    // Convert Persian digits to English and remove all non-digit characters
    let englishValue = event.target.value
      .split('')
      .map((c) => {
        const persianDigits = [
          '۰',
          '۱',
          '۲',
          '۳',
          '۴',
          '۵',
          '۶',
          '۷',
          '۸',
          '۹',
        ];
        const index = persianDigits.indexOf(c);
        return index >= 0 ? index.toString() : c;
      })
      .join('')
      .replace(/\D/g, '');

    // Update the state with the English number (or empty string)
    const newValue = englishValue === '' ? null : Number(englishValue);
    setAccount1Data((pre) => ({
      ...pre,
      beneficiary_user_address: {
        ...pre.beneficiary_user_address,
        building_number: newValue,
      },
    }));
    // Update the displayed value with Persian digits (no commas)
    const displayValue =
      englishValue === '' ? '' : toPersianDigits(englishValue);
    event.target.value = displayValue;
  };
  const handleMapConfirm = async() => {
    setIsLoadingButtonMap(true)
    setAccount1Data((pre) => ({
      ...pre,
      beneficiary_user_address: {
        ...pre.beneficiary_user_address,
        latitude: position[0],
        longitude: position[1],
      },
    }));

    if (
      hasAddress 
    ) {
      try {
        const response = await fetch(
          `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/update-user-address/`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify({
              longitude:
                position[1] || null,
              latitude:
                position[0] || null,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Update failed');
        }

        const result = await response.json();
        console.log(result);
        setIsLoadingButtonMap(false)
        setSubmitMap(true);
        setLoad(true);
        setTimeout(() => setSubmitMap(false), 5000);
      } catch (err) {
        console.error(err);
        setIsLoadingButtonMap(false)
      }
    } else if (
      !hasAddress
    ) {
      try {
        const response = await fetch(
          `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/create-user-address/`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify({
              latitude:
                position[0] || null,
              longitude:
                position[1] || null,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Creation failed');
        }

        const result = await response.json();
        console.log(result);
        setIsLoadingButtonMap(false)
        setSubmitMap(true);
        setLoad(true);
        setTimeout(() => setSubmitMap(false), 5000);
      } catch (err) {
        setIsLoadingButtonMap(false)
        console.error(err);
      }
    }
  };

  const handleNeighborChange = (e) => {
    setBlur((pre) => ({ ...pre, neighbor: false }));
    setAccount1Data((pre) => ({
      ...pre,
      beneficiary_user_address: {
        ...pre.beneficiary_user_address,
        neighborhood: e.target.value,
      },
    }));
    setValidation((pre) => ({ ...pre, neighbor: isPersian(e.target.value) }));
  };

  const handleStreetChange = (e) => {
    setBlur((pre) => ({ ...pre, street: false }));
    setAccount1Data((pre) => ({
      ...pre,
      beneficiary_user_address: {
        ...pre.beneficiary_user_address,
        street: e.target.value,
      },
    }));
    setValidation((pre) => ({ ...pre, street: isPersian(e.target.value) }));
  };

  const handleAlleyChange = (e) => {
    setBlur((pre) => ({ ...pre, alley: false }));
    setAccount1Data((pre) => ({
      ...pre,
      beneficiary_user_address: {
        ...pre.beneficiary_user_address,
        alley: e.target.value,
      },
    }));
    setValidation((pre) => ({ ...pre, alley: isPersian(e.target.value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingButtonAddress(true)
    if (
      hasAddress &&
      (validation.neighbor ||
        account1Data?.beneficiary_user_address?.neighborhood === '' ||
        account1Data?.beneficiary_user_address?.neighborhood === null) &&
      (validation.street ||
        account1Data?.beneficiary_user_address?.street === '' ||
        account1Data?.beneficiary_user_address?.street === null) &&
      (validation.alley ||
        account1Data?.beneficiary_user_address?.alley === '' ||
        account1Data?.beneficiary_user_address?.alley === null) &&
      (validation.postal_code ||
        account1Data?.beneficiary_user_address?.postal_code === '' ||
        account1Data?.beneficiary_user_address?.postal_code === null)
    ) {
      try {
        const response = await fetch(
          `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/update-user-address/`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify({
              alley: account1Data?.beneficiary_user_address?.alley || null,
              building_number:
                account1Data?.beneficiary_user_address?.building_number || null,
              city: account1Data?.beneficiary_user_address?.city || null,
              neighborhood:
                account1Data?.beneficiary_user_address?.neighborhood || null,
              postal_code:
                account1Data?.beneficiary_user_address?.postal_code || null,
              province:
                account1Data?.beneficiary_user_address?.province || null,
              street: account1Data?.beneficiary_user_address?.street || null,
              unit: account1Data?.beneficiary_user_address?.unit || null,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Update failed');
        }

        const result = await response.json();
        console.log(result);
        setIsLoadingButtonAddress(false)
        setSubmit(true);
        setLoad(true);
        setTimeout(() => setSubmit(false), 5000);
      } catch (err) {
        console.error(err);
        setIsLoadingButtonAddress(false)
      }
    } else if (
      !hasAddress &&
      (validation.neighbor ||
        account1Data?.beneficiary_user_address?.neighborhood === '' ||
        account1Data?.beneficiary_user_address?.neighborhood === null) &&
      (validation.street ||
        account1Data?.beneficiary_user_address?.street === '' ||
        account1Data?.beneficiary_user_address?.street === null) &&
      (validation.alley ||
        account1Data?.beneficiary_user_address?.alley === '' ||
        account1Data?.beneficiary_user_address?.alley === null) &&
      (validation.postal_code ||
        account1Data?.beneficiary_user_address?.postal_code === '' ||
        account1Data?.beneficiary_user_address?.postal_code === null)
    ) {
      try {
        const response = await fetch(
          `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/create-user-address/`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify({
              alley: account1Data?.beneficiary_user_address?.alley || null,
              building_number:
                account1Data?.beneficiary_user_address?.building_number || null,
              city: account1Data?.beneficiary_user_address?.city || null,
              neighborhood:
                account1Data?.beneficiary_user_address?.neighborhood || null,
              postal_code:
                account1Data?.beneficiary_user_address?.postal_code || null,
              province:
                account1Data?.beneficiary_user_address?.province || null,
              street: account1Data?.beneficiary_user_address?.street || null,
              unit: account1Data?.beneficiary_user_address?.unit || null,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Creation failed');
        }

        const result = await response.json();
        console.log(result);
        setIsLoadingButtonAddress(false)
        setSubmit(true);
        setLoad(true);
        setTimeout(() => setSubmit(false), 5000);
      } catch (err) {
        console.error(err);
        setIsLoadingButtonAddress(false)
      }
    }
  };
  const handleMyLocation = async() => {
    setPosition(userLocation)
    setAccount1Data((pre) => ({
      ...pre,
      beneficiary_user_address: {
        ...pre.beneficiary_user_address,
        latitude: userLocation[0],
        longitude: userLocation[1],
      },
    }));

    if (
      hasAddress 
    ) {
      try {
        const response = await fetch(
          `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/update-user-address/`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify({
              longitude:
                userLocation[1] || null,
              latitude:
                userLocation[0] || null,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Update failed');
        }

        const result = await response.json();
        console.log(result);
        setSubmitMap(true);
        setLoad(true);
        setTimeout(() => setSubmitMap(false), 5000);
      } catch (err) {
        console.error(err);
      }
    } else if (
      !hasAddress
    ) {
      try {
        const response = await fetch(
          `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/create-user-address/`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify({
              latitude:
                position[0] || null,
              longitude:
                position[1] || null,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Creation failed');
        }

        const result = await response.json();
        console.log(result);
        setSubmitMap(true);
        setLoad(true);
        setTimeout(() => setSubmitMap(false), 5000);
      } catch (err) {
        console.error(err);
      }
    }
  }
  useEffect(() => {
    document.documentElement.classList.add('account-container3-html');
    document.body.classList.add('account-container3-body');

    return () => {
      document.documentElement.classList.remove('account-container3-html');
      document.body.classList.remove('account-container3-body');
    };
  }, []);

  return (
    <div className="account-container3">
      <Header />
      <main className="main">
        <section style={{padding:"0 10px"}}>
          <h1>
            با انتخاب هر یک از موارد زیر، می‌توانید با تکمیل بخش‌های خالی اقدام
            به اشتراک اطلاعات خود با خیریه کنید.
          </h1>
        </section>

        <nav className="nav-up">
          <ul className="nav-list-up">
            <li onClick={() => setStep(1)} className="nav-item-up">
              <a style={{color:"#000"}}>اطلاعات حساب کاربری</a>
            </li>
            <li onClick={() => setStep(2)} className="nav-item-up">
              <a style={{color:"#000"}}>اطلاعات شخصی کاربر</a>
            </li>
            <li
              onClick={() => setStep(3)}
              className="nav-item-up"
              id="active-nav-up"
            >
              <a style={{color:"#fff"}}>اطلاعات آدرس کاربر</a>
            </li>
            <li onClick={() => setStep(4)} className="nav-item-up">
              <a style={{color:"#000"}}>اطلاعات تکمیلی کاربر</a>
            </li>
          </ul>
        </nav>

        <form className="account-form3" onSubmit={handleSubmit}>
          <div className="form-up">
            <div className='input-browser-border'>
              <label htmlFor="account-province"> استان: </label>
              <select
                id="account-province"
                value={account1Data?.beneficiary_user_address?.province || null}
                onChange={(e) => {
                  if (e.target.value !== null) {
                    setAccount1Data((pre) => ({
                      ...pre,
                      beneficiary_user_address: {
                        ...pre.beneficiary_user_address,
                        province: Number(e.target.value),
                        city: null,
                      },
                    }));
                  } else {
                    setAccount1Data((pre) => ({
                      ...pre,
                      beneficiary_user_address: {
                        ...pre.beneficiary_user_address,
                        province: null,
                        city: null,
                      },
                    }));
                  }
                }}
              >
                <option value={null}></option>
                {provinces
                  .slice()
                  .sort((a, b) => a.province_name.localeCompare(b.province_name, 'fa'))
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.province_name}
                    </option>
                  ))}
              </select>
            </div>

            <div className='input-browser-border'>
              <label htmlFor="account-city"> شهر: </label>
              {account1Data?.beneficiary_user_address?.province ? (
                <select
                  id="account-city"
                  value={account1Data?.beneficiary_user_address?.city || ''}
                  onChange={(e) => {
                    if (e.target.value !== null) {
                      setAccount1Data((pre) => ({
                        ...pre,
                        beneficiary_user_address: {
                          ...pre.beneficiary_user_address,
                          city: Number(e.target.value),
                        },
                      }));
                    } else {
                      setAccount1Data((pre) => ({
                        ...pre,
                        beneficiary_user_address: {
                          ...pre.beneficiary_user_address,
                          city: null,
                        },
                      }));
                    }
                  }}
                >
                  <option value={null}> </option>
                  {cities
                    .filter(
                      (item) =>
                        item.province ===
                        account1Data.beneficiary_user_address.province
                    )
                    .slice()
                    .sort((a, b) => a.city_name.localeCompare(b.city_name, 'fa'))
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.city_name}
                      </option>
                    ))}
                </select>
              ) : (
                <select
                  id="account-city"
                  value={account1Data?.beneficiary_user_address?.city || ''}
                >
                  <option value="">
                    لطفا ابتدا استان محل زندگی خود را انتخاب کنید
                  </option>
                </select>
              )}
            </div>

            <div className='input-browser-border'>
              <label htmlFor="account-neighbor"> محله: </label>
              <input
                type="text"
                id="account-neighbor"
                value={
                  account1Data?.beneficiary_user_address?.neighborhood || ''
                }
                onChange={handleNeighborChange}
                onBlur={() => setBlur((pre) => ({ ...pre, neighbor: true }))}
              />
            </div>

            <div className='input-browser-border'>
              <label htmlFor="account-postal"> کد پستی:</label>
              <input
                type="text"
                id="account-postal"
                inputMode="numeric"
                value={
                  account1Data?.beneficiary_user_address?.postal_code
                    ? toPersianDigits(
                        account1Data?.beneficiary_user_address?.postal_code
                      ).toString()
                    : null
                }
                onChange={handlePostalCodeChange}
                onBlur={() => setBlur((pre) => ({ ...pre, postal_code: true }))}
                maxLength={10}
                style={{direction:"ltr"}}
              />
            </div>

            <div className='input-browser-border'>
              <label htmlFor="account-street"> خیابان: </label>
              <input
                type="text"
                id="account-street"
                value={account1Data?.beneficiary_user_address?.street || ''}
                onChange={handleStreetChange}
                onBlur={() => setBlur((pre) => ({ ...pre, street: true }))}
              />
            </div>

            <div className='input-browser-border'>
              <label htmlFor="account-alley"> کوچه: </label>
              <input
                type="text"
                id="account-alley"
                value={account1Data?.beneficiary_user_address?.alley || ''}
                onChange={handleAlleyChange}
                onBlur={() => setBlur((pre) => ({ ...pre, alley: true }))}
              />
            </div>

            <div className='input-browser-border'>
              <label htmlFor="account-building-num"> پلاک: </label>
              <input
                type="text"
                id="account-building-num"
                inputMode="numeric"
                value={
                  account1Data?.beneficiary_user_address?.building_number
                    ? toPersianDigits(
                        account1Data?.beneficiary_user_address?.building_number.toString()
                      )
                    : null
                }
                onChange={handleBuildingNumberChange}
                style={{direction:"ltr"}}
              />
            </div>

            <div className='input-browser-border'>
              <label htmlFor="account-unit"> واحد: </label>
              <input
                type="text"
                id="account-unit"
                inputMode="numeric"
                value={
                  account1Data?.beneficiary_user_address?.unit
                    ? toPersianDigits(
                        account1Data?.beneficiary_user_address?.unit.toString()
                      )
                    : null
                }
                onChange={handleUnitChange}
                style={{direction:"ltr"}}
              />
            </div>
          </div>

          <div id="account-submit3">
            {submit ? (
              <div>
                <svg
                  width="16"
                  height="14"
                  viewBox="0 0 16 14"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M14.7373 0L4.94741 11.1961L1.22585 6.93997L0 8.34191L4.94741 14L15.9631 1.40194L14.7373 0Z" />
                </svg>
                اطلاعات با موفقیت ثبت گردید
              </div>
            ) : (
              <div style={{ visibility: 'hidden' }}>
                <svg
                  width="16"
                  height="14"
                  viewBox="0 0 16 14"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M14.7373 0L4.94741 11.1961L1.22585 6.93997L0 8.34191L4.94741 14L15.9631 1.40194L14.7373 0Z" />
                </svg>
                اطلاعات با موفقیت ثبت گردید
              </div>
            )}
            {((!validation.neighbor &&
              account1Data?.beneficiary_user_address?.neighborhood !== '' &&
              account1Data?.beneficiary_user_address?.neighborhood !== null) ||
              (!validation.street &&
                account1Data?.beneficiary_user_address?.street !== '' &&
                account1Data?.beneficiary_user_address?.street !== null) ||
              (!validation.alley &&
                account1Data?.beneficiary_user_address?.alley !== '' &&
                account1Data?.beneficiary_user_address?.alley !== null)) &&
              blur.neighbor &&
              blur.street &&
              blur.alley && (
                <div className="error-message">
                  لطفا نام محله و خیابان و کوچه خود را به فارسی وارد کنید
                </div>
              )}
            {!validation.postal_code &&
              blur.postal_code &&
              account1Data?.beneficiary_user_address?.postal_code !== '' &&
              account1Data?.beneficiary_user_address?.postal_code !== null && (
                <div className="error-message">
                  لطفا یک کدپستی ده رقمی معتبر وارد کنید
                </div>
              )}
            {isLoadingButtonAddress?<button style={{width:"75px"}}><LoadingButton dimension={10} stroke={2} color={'#fff'} /></button>:<input type="submit" value="تأیید" className='address-submit'/>}
          </div>

          <section style={{position:"relative", zIndex: 1}}>
            <p>آدرس خود را برروی نقشه زیر تعیین کنید:</p>
            <div className='map-style' style={{ position: 'relative' }}>
              <div
                id="map"
                ref={mapRef}
                style={{ width: '100%', position: 'relative', zIndex: 0 }}
              >
                <MapContainer
                  center={position}
                  zoom={5}
                  style={{ height: '100%', width: '100%' }}
                  whenCreated={(map) => {
                  setTimeout(() => {
                    map.invalidateSize();
                  }, 300);
                  if(useUserLocation || !useUserLocation){
                  L.control
                    .locate({
                      position: 'topright',
                      strings: {
                        title: 'نمایش موقعیت من',
                      },
                      setView: true,
                      flyTo: true,
                    })
                    .addTo(map);
                  }
                }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker
                    position={position}
                    setPosition={(latlng) =>
                      setPosition([latlng.lat, latlng.lng])
                    }
                  />
                </MapContainer>
              </div>
            </div>
            <div className='map-button-success-container'>
              {submitMap ? (
              <div className='button-container-success'>
                <svg
                  width="16"
                  height="14"
                  viewBox="0 0 16 14"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M14.7373 0L4.94741 11.1961L1.22585 6.93997L0 8.34191L4.94741 14L15.9631 1.40194L14.7373 0Z" />
                </svg>
                موقعیت با موفقیت ثبت گردید
              </div> ):
              <div style={{ visibility: 'hidden' }}>
                <svg
                  width="16"
                  height="14"
                  viewBox="0 0 16 14"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M14.7373 0L4.94741 11.1961L1.22585 6.93997L0 8.34191L4.94741 14L15.9631 1.40194L14.7373 0Z" />
                </svg>
                موقعیت با موفقیت ثبت گردید
              </div>
            }

            <div className='button-container'>
              <button
                type="button"
                onClick={handleMapConfirm}
                style={isLoadingButtonMap?{marginTop: "10px",width:`${mapWidth}px`}:{ marginTop: '10px' }}
                className='map-submit'

              >
                {isLoadingButtonMap?<LoadingButton dimension={10} stroke={2} color={'#fff'} />:"ثبت موقعیت"}
              </button>
            </div>
            {userLocation && 
            <div className='button-container'>
              <button
                type="button"
                onClick={handleMyLocation}
                style={isLoadingButtonMap?{marginTop: "10px",width:`${mapWidth}px`}:{ marginTop: '10px' }}
                className='map-submit'

              >
                موقعیت مکانی من
              </button>
            </div>}
            </div>
          </section>

        </form>
      </main>
      <NavigationBar selected={4} />
    </div>
  );
}

export default Account3;