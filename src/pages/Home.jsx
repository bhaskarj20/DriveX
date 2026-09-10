function Home({ onLogin }) {
  const scrollToHowItWorks = () => {
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  return (
    <div className="home-page">
      {/* ================= HERO ================= */}
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-label">
            INTELLIGENT VEHICLE SAFETY
          </p>

          <h1>
            Drive Smarter.
            <br />
            Stay Safer.
          </h1>

          <p className="hero-description">
            DriveX is a smart vehicle and driver
            monitoring platform designed to understand
            driving conditions, detect potential risks,
            and respond when safety matters most.
          </p>

          <div className="hero-buttons">
            <button onClick={onLogin}>
              🚗 Get Started
            </button>

            <button
              className="secondary-button"
              onClick={scrollToHowItWorks}
            >
              Explore DriveX
            </button>
          </div>

          <div className="hero-highlights">
            <span>✓ Driver Monitoring</span>
            <span>✓ Risk Detection</span>
            <span>✓ Emergency Response</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-dashboard-card">
            <div className="hero-dashboard-header">
              <div>
                <span>DriveX</span>
                <p>Live Safety System</p>
              </div>

              <span className="live-indicator">
                ● LIVE
              </span>
            </div>

            <div className="hero-metrics">
              <div className="hero-metric">
                <span>❤️ Heart Rate</span>
                <strong>76 BPM</strong>
              </div>

              <div className="hero-metric">
                <span>🚗 Speed</span>
                <strong>52 km/h</strong>
              </div>

              <div className="hero-metric">
                <span>🧠 Driver State</span>
                <strong>ALERT</strong>
              </div>

              <div className="hero-metric">
                <span>⚠️ Risk Score</span>
                <strong>1/10</strong>
              </div>
            </div>

            <div className="hero-status">
              <span className="status-dot"></span>
              Vehicle and driver monitoring active
            </div>
          </div>
        </div>
      </section>

      {/* ================= SAFETY OVERVIEW ================= */}
      <section className="safety-overview">
        <div className="section-heading">
          <p>ONE PLATFORM</p>
          <h2>
            Everything you need to monitor a safer drive
          </h2>
        </div>

        <div className="overview-features">
          <div className="overview-feature">
            <span>📷</span>
            <div>
              <h3>Driver Vision</h3>
              <p>
                Monitor facial cues, eye openness,
                drowsiness, and driver distraction.
              </p>
            </div>
          </div>

          <div className="overview-feature">
            <span>❤️</span>
            <div>
              <h3>Heart Rate</h3>
              <p>
                Track driver heart-rate signals
                alongside vehicle telemetry.
              </p>
            </div>
          </div>

          <div className="overview-feature">
            <span>📊</span>
            <div>
              <h3>Risk Intelligence</h3>
              <p>
                Combine multiple safety signals into
                a simple real-time risk score.
              </p>
            </div>
          </div>

          <div className="overview-feature">
            <span>📍</span>
            <div>
              <h3>Live Location</h3>
              <p>
                Keep track of the vehicle's current
                location during an active drive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        className="how-it-works"
        id="how-it-works"
      >
        <div className="section-heading">
          <p>HOW IT WORKS</p>

          <h2>
            Smart safety from start to finish
          </h2>

          <span>
            DriveX brings vehicle telemetry and driver
            monitoring together in one workflow.
          </span>
        </div>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">01</div>

            <div className="step-icon">🚗</div>

            <h3>Start the Drive</h3>

            <p>
              Begin a drive session and complete the
              pre-drive safety check.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>

            <div className="step-icon">📡</div>

            <h3>Monitor</h3>

            <p>
              DriveX continuously receives vehicle
              and driver monitoring signals.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>

            <div className="step-icon">🧠</div>

            <h3>Detect Risk</h3>

            <p>
              The system evaluates speed, motion,
              heart rate, drowsiness, and distraction.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">04</div>

            <div className="step-icon">🚨</div>

            <h3>Respond</h3>

            <p>
              When a serious condition is detected,
              DriveX initiates the emergency workflow.
            </p>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="features-section">
        <div className="section-heading">
          <p>KEY FEATURES</p>

          <h2>
            Built around real driving conditions
          </h2>

          <span>
            Designed to turn multiple safety signals
            into meaningful information.
          </span>
        </div>

        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">🚗</div>

            <h3>Vehicle Monitoring</h3>

            <p>
              Monitor speed, motion, temperature,
              battery status, and vehicle events in
              real time.
            </p>

            <span className="feature-tag">
              LIVE TELEMETRY
            </span>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📷</div>

            <h3>Driver Vision</h3>

            <p>
              Camera-based monitoring helps identify
              drowsiness and prolonged driver
              distraction.
            </p>

            <span className="feature-tag">
              COMPUTER VISION
            </span>
          </div>

          <div className="feature-card">
            <div className="feature-icon">❤️</div>

            <h3>Heart Rate Monitoring</h3>

            <p>
              Combine driver heart-rate signals with
              vehicle conditions to improve risk
              awareness.
            </p>

            <span className="feature-tag">
              SENSOR DATA
            </span>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚠️</div>

            <h3>Risk Detection</h3>

            <p>
              Multiple signals contribute to a
              real-time risk score from Low to High.
            </p>

            <span className="feature-tag">
              RISK ENGINE
            </span>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🚨</div>

            <h3>Emergency Response</h3>

            <p>
              Detect serious conditions and start the
              emergency response workflow automatically.
            </p>

            <span className="feature-tag">
              SAFETY RESPONSE
            </span>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>

            <h3>AI Safety Copilot</h3>

            <p>
              Get intelligent assistance about the
              vehicle, driver state, and dashboard data.
            </p>

            <span className="feature-tag">
              AI ASSISTANCE
            </span>
          </div>
        </div>
      </section>

      {/* ================= LIVE SAFETY ================= */}
      <section className="live-safety-section">
        <div className="live-safety-content">
          <p className="section-label">
            REAL-TIME SAFETY
          </p>

          <h2>
            One dashboard.
            <br />
            Multiple safety signals.
          </h2>

          <p>
            DriveX brings vehicle telemetry, driver
            vision, heart-rate monitoring, risk
            analysis, location, and emergency
            detection together in a single system.
          </p>

          <div className="live-safety-points">
            <div>
              <strong>01</strong>
              <span>Monitor vehicle conditions</span>
            </div>

            <div>
              <strong>02</strong>
              <span>Understand driver state</span>
            </div>

            <div>
              <strong>03</strong>
              <span>Evaluate safety risk</span>
            </div>

            <div>
              <strong>04</strong>
              <span>Respond to emergencies</span>
            </div>
          </div>
        </div>

        <div className="risk-preview">
          <div className="risk-preview-header">
            <span>LIVE RISK MONITOR</span>
            <span className="risk-status">
              NORMAL
            </span>
          </div>

          <div className="risk-score-preview">
            <strong>1</strong>
            <span>/10</span>
          </div>

          <p>Current Risk Score</p>

          <div className="risk-bar">
            <div></div>
          </div>

          <div className="risk-signals">
            <span>✓ Speed Normal</span>
            <span>✓ Driver Alert</span>
            <span>✓ Heart Rate Normal</span>
            <span>✓ No Emergency</span>
          </div>
        </div>
      </section>

      {/* ================= EMERGENCY ================= */}
      <section className="emergency-feature-section">
        <div className="emergency-feature-card">
          <div className="emergency-feature-icon">
            🚨
          </div>

          <div>
            <p>WHEN EVERY SECOND MATTERS</p>

            <h2>
              DriveX is designed to detect,
              evaluate, and respond.
            </h2>

            <p>
              From sudden braking and abnormal motion
              to driver drowsiness and critical driver
              states, DriveX combines signals to identify
              potentially dangerous situations.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="get-started-section">
        <div className="get-started-content">
          <p>READY TO DRIVE SMARTER?</p>

          <h2>
            Experience the DriveX safety dashboard.
          </h2>

          <p>
            Explore real-time monitoring, driver
            intelligence, risk detection, emergency
            response, and AI assistance.
          </p>

          <button onClick={onLogin}>
            🚗 Open DriveX
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
