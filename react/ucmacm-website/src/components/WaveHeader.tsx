import '../index.css'
function WaveHeader() {
  return (
    <>
      <div className="bg-landing opacity-80 py-8 w-full max-h-max top-16 gap-16 flex-col flex">
        <p>hi</p>
      </div>
      <div className="z-0 gap-16 flex">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#00e1bf"
            fillOpacity="0.8"
            d="M0,256L80,224C160,192,320,128,480,122.7C640,117,800,171,960,192C1120,213,1280,203,1360,197.3L1440,192L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          ></path>
        </svg>
      </div>
    </>
  )
}

export default WaveHeader
