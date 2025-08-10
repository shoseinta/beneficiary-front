// AddToHomeAnim.jsx
import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

export default function AddToHomeAnim() {
  const ref = useRef(null);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: ref.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/lottie_iphone.json', // JSON file in /public
    });

    return () => anim?.destroy();
  }, []);

  return <div ref={ref} />;
}