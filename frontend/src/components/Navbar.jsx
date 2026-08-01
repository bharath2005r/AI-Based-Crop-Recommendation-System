function Navbar() {
  return (
    <header className="app-header">
      <div className="header-content">

        {/* Center: Title with Golden Leaf Crest */}
        <div className="header-title-container">
          <div className="title-wrapper">
            <svg className="leaf-ornament leaf-left" viewBox="0 0 60 30" fill="currentColor">
              <path d="M0,15 Q30,0 60,15 Q30,30 0,15 Z M20,10 Q35,5 50,15 M10,18 Q30,12 45,22" />
              <path d="M15,12 C10,5 5,8 2,12 C5,10 10,10 15,12 Z" />
              <path d="M30,8 C25,2 20,4 17,8 C20,6 25,6 30,8 Z" />
              <path d="M42,11 C38,4 32,5 28,9 C32,7 37,7 42,11 Z" />
            </svg>

            <h1 className="header-title">
              CROP RECOMMENDATION SYSTEM
            </h1>

            <svg className="leaf-ornament leaf-right" viewBox="0 0 60 30" fill="currentColor">
              <path d="M60,15 Q30,0 0,15 Q30,30 60,15 Z M40,10 Q25,5 10,15 M50,18 Q30,12 15,22" />
              <path d="M45,12 C50,5 55,8 58,12 C55,10 50,10 45,12 Z" />
              <path d="M30,8 C35,2 40,4 43,8 C40,6 35,6 30,8 Z" />
              <path d="M18,11 C22,4 28,5 32,9 C28,7 23,7 18,11 Z" />
            </svg>
          </div>
          <div className="header-sub-divider">
            <span className="divider-line"></span>
            <span className="divider-leaf">❖</span>
            <span className="divider-line"></span>
          </div>
        </div>

      </div>
    </header>
  );
}

export default Navbar;