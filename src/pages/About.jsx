import './About.css';

const About = () => {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <p className="eyebrow">ABOUT US</p>
            <h1>Your trusted <span>online pharmacy</span></h1>
            <p className="hero-subtitle">
              HealthEasy delivers genuine medicines and healthcare essentials right to your door.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="container stats-grid">
          <div className="stat-card">
            <h2>200+</h2>
            <p>Cities Covered</p>
          </div>
          <div className="stat-card">
            <h2>10K+</h2>
            <p>Partner Pharmacies</p>
          </div>
          <div className="stat-card">
            <h2>99.5%</h2>
            <p>On-time Delivery</p>
          </div>
          <div className="stat-card">
            <h2>4.8★</h2>
            <p>Customer Rating</p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mission">
        <div className="container">
          <div className="mission-card">
            <h2>Our Mission</h2>
            <p>
              To make healthcare accessible and convenient for everyone through reliable 
              medicine delivery and excellent customer service.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why choose HealthEasy</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Verified Medicines</h3>
              <p>All medicines sourced from licensed pharmacies with quality assurance.</p>
            </div>
            <div className="feature-card">
              <h3>Expert Support</h3>
              <p>Professional pharmacists available to help with your healthcare needs.</p>
            </div>
            <div className="feature-card">
              <h3>Fast Delivery</h3>
              <p>Quick and reliable delivery service to your doorstep.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;