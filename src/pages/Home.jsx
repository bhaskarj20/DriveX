function Home({ onLogin }) {
  return (
    <div className="home-page">

      <section className="hero-section">

        <div className="hero-content">
          <p className="hero-label">SMART VEHICLE SAFETY</p>

          <h1>
            Drive Smarter.
            <br />
            Stay Safer.
          </h1>

          <p className="hero-description">
            SmartDrive is a smart vehicle monitoring platform
            designed to monitor vehicle and driver conditions,
            detect potential emergencies, and provide intelligent assistance.
          </p>

          <div className="hero-buttons">
            <button onClick={onLogin}>Get Started</button>
            <button
  className="secondary-button"
  onClick={() =>
    document.getElementById("how-it-works").scrollIntoView({
      behavior: "smooth"
    })
  }
>
  How It Works
</button>
          </div>
        </div>

      </section>
      <section className="how-it-works" id="how-it-works">
  <div className="section-heading">
    <p>HOW IT WORKS</p>
    <h2>Smart safety in three simple steps</h2>
  </div>

  <div className="steps-container">

    <div className="step-card">
      <div className="step-icon">📡</div>
      <h3>Monitor</h3>
      <p>
        SmartDrive monitors important vehicle and driver information.
      </p>
    </div>

    <div className="step-card">
      <div className="step-icon">🧠</div>
      <h3>Detect</h3>
      <p>
        The system identifies unusual conditions and potential emergencies.
      </p>
    </div>

    <div className="step-card">
      <div className="step-icon">🚨</div>
      <h3>Respond</h3>
      <p>
        When an emergency occurs, SmartDrive starts the response process.
      </p>
    </div>

  </div>
</section>
<section className="features-section">
  <div className="section-heading">
    <p>KEY FEATURES</p>
    <h2>Built for safer journeys</h2>
  </div>

  <div className="features-container">

    <div className="feature-card">
      <div className="feature-icon">🚗</div>
      <h3>Vehicle Monitoring</h3>
      <p>
        Monitor the current status of your vehicle through the SmartDrive dashboard.
      </p>
    </div>

    <div className="feature-card">
      <div className="feature-icon">❤️</div>
      <h3>Driver Monitoring</h3>
      <p>
        Keep track of important driver information such as heart rate.
      </p>
    </div>

    <div className="feature-card">
      <div className="feature-icon">🚨</div>
      <h3>Emergency Response</h3>
      <p>
        Simulate accident detection and initiate an emergency response process.
      </p>
    </div>

    <div className="feature-card">
      <div className="feature-icon">🤖</div>
      <h3>AI Assistant</h3>
      <p>
        Ask questions about your SmartDrive dashboard and get intelligent assistance.
      </p>
    </div>

  </div>
</section>
<section className="get-started-section">
  <div className="get-started-content">
    <p>GET STARTED</p>

    <h2>Ready to make every journey safer?</h2>

    <p>
      Explore the SmartDrive dashboard and experience
      vehicle monitoring, emergency assistance, and AI support.
    </p>

    <button onClick={onLogin}>Open Dashboard</button>
  </div>
</section>

    </div>
  );
}

export default Home;