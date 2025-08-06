// components/map/LocateControl.js
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import * as L from 'leaflet'; // ✅ named import
import 'leaflet.locatecontrol';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';

const LocateControl = () => {
  const map = useMap();

  useEffect(() => {
    const control = L.control
      .locate({
        position: 'topright',
        setView: true,
        flyTo: true,
        keepCurrentZoomLevel: true,
        showPopup: false,
        drawCircle: true,
        locateOptions: {
          enableHighAccuracy: true,
        },
        strings: {
          title: 'نمایش موقعیت من',
        },
      })
      .addTo(map);

    return () => {
      control.remove();
    };
  }, [map]);

  return null;
};

export default LocateControl;