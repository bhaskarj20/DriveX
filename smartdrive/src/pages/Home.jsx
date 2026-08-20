function Home({ onLogin }) {
  return (
    <div className="home-page">
      <div className="home-content">
        <h1>🚗 SmartDrive</h1>

        <h2>Driver Safety & Emergency Assistance</h2>

        <p>
          SmartDrive is a vehicle safety system designed to
          monitor drivers and respond quickly during emergencies.
        </p>

        <button className="primary-button" onClick={onLogin}>
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Home;