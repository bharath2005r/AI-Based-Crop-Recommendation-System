import bg from "../assets/bg.jpg";
import tractor from "../assets/tractor.jpg"; // Change to .png if your tractor is PNG

function Hero() {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      <div className="hero-overlay">
        <div className="hero-content">

          <div className="hero-text">
            <h2>
              Smart Farming,
              <br />
              Better Yields
            </h2>

            <p>
              Get the best crop recommendations using Machine Learning
              and scientific analysis.
            </p>
          </div>

          <div className="hero-image">
            <img
              src={tractor}
              alt="Tractor"
            />
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;