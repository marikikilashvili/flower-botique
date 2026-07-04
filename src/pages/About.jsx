export default function About() {
  return (
    <section className="section about">
      <div className="about__intro">
        <p className="hero__eyebrow">About Bloomery</p>
        <h1>A studio for people who read the label on a flower.</h1>
        <p>
          Bloomery began as a university project reimagining a fragrance boutique as a
          botanical one. Rather than showing you a picture and a price, we pair every
          bloom with the growing details botanists actually record — its family, its
          watering habits, the pollinators it attracts.
        </p>
      </div>

      <div className="about__grid">
        <div className="about__card">
          <h3>What we use</h3>
          <p>
            React, React Router and Axios power the app; flower data and photography come
            from the Perenual botanical API. Your bouquet is saved to this browser's local
            storage, so it's still here next time you visit.
          </p>
        </div>
        <div className="about__card">
          <h3>Why it looks this way</h3>
          <p>
            Rose pink, soft gradients and organic petal-shaped frames throughout — a
            deliberately calm, editorial take on an online shop, built to feel like
            paging through a florist's notebook.
          </p>
        </div>
        <div className="about__card">
          <h3>A student project</h3>
          <p>
            Built as a front-end assignment to practice hooks, routing, HTTP requests and
            state that survives a page reload — dressed up as a flower shop instead of a
            perfumery.
          </p>
        </div>
      </div>
    </section>
  );
}
