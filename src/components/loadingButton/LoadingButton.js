import './LoadingButton.css';

function LoadingButton ({dimension,stroke, color}) {
  return (
    <svg
  width={2*dimension}
  height={2*dimension}
  viewBox={`0 0 ${2*dimension} ${2*dimension}`}
  color={color}
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    <linearGradient id="spinner-secondHalf">
      <stop offset="0%" stop-opacity="0" stop-color="currentColor" />
      <stop offset="100%" stop-opacity="0.5" stop-color="currentColor" />
    </linearGradient>
    <linearGradient id="spinner-firstHalf">
      <stop offset="0%" stop-opacity="1" stop-color="currentColor" />
      <stop offset="100%" stop-opacity="0.5" stop-color="currentColor" />
    </linearGradient>
  </defs>

  <g className="spinner" stroke-width={2 * stroke}>
    <path stroke="url(#spinner-secondHalf)" d={`M ${stroke} ${dimension} A ${dimension-stroke} ${dimension-stroke} 0 0 1 ${2*dimension - stroke} ${dimension}`} />
    <path stroke="url(#spinner-firstHalf)" d={`M ${2*dimension-stroke} ${dimension} A ${dimension-stroke} ${dimension-stroke} 0 0 1 ${stroke} ${dimension}`} />

    <path
      stroke="currentColor"
      stroke-linecap="round"
      d={`M ${stroke} ${dimension} A ${dimension-stroke} ${dimension-stroke} 0 0 1 ${stroke} ${dimension}`}
    />
  </g>
</svg>
  )
}

export default LoadingButton;