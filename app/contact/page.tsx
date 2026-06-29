import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Footer } from "@/components/Footer";
import { SiteNav } from "@/components/SiteNav";
import { business } from "@/lib/business";

export default function ContactPage() {
  return (
    <main className="site-shell">
      <SiteNav />
      <section className="contact-section" data-reveal>
        <div className="container">
          <div className="section-head">
            <h2>Contact</h2>
            <p>Visit the bakery, call ahead, or send us a message for special requests and events.</p>
          </div>
          <div className="contact-layout">
            <div className="contact-stack">
              <div className="contact-cards">
                <a className="card contact-box" href={`tel:${business.phone.replaceAll(" ", "")}`} data-reveal>
                  <Phone size={28} aria-hidden="true" />
                  <h3>Phone</h3>
                  <p>{business.phone}</p>
                </a>
                <a className="card contact-box" href={`mailto:${business.email}`} data-reveal>
                  <Mail size={28} aria-hidden="true" />
                  <h3>Email</h3>
                  <p>{business.email}</p>
                </a>
                <a className="card contact-box" href={business.mapUrl} target="_blank" rel="noreferrer" data-reveal>
                  <MapPin size={28} aria-hidden="true" />
                  <h3>Address</h3>
                  <p>{business.address}</p>
                </a>
              </div>

              <article className="card contact-box contact-map-card" data-reveal>
                <div className="contact-map-header">
                  <div>
                    <p className="kicker">Find us</p>
                    <h3>Our location in Calais</h3>
                  </div>
                  <a className="button secondary" href={business.mapUrl} target="_blank" rel="noreferrer">
                    Open in Maps
                  </a>
                </div>
                <div className="contact-map-frame">
                  <iframe
                    title="L'Eclair de Calais map"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(business.address)}&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </article>
            </div>

            <div className="contact-sidebar">
              <article className="card contact-box" data-reveal>
                <h3>Opening hours</h3>
                <div className="hours">
                  {business.hours.map(([day, hours]: [string, string]) => (
                    <div key={day}>
                      <span>{day}</span>
                      <strong>{hours}</strong>
                    </div>
                  ))}
                </div>
              </article>

              <article className="card contact-box contact-form-card" data-reveal>
                <p className="kicker">Send a message</p>
                <h3>Quick contact form</h3>
                <form className="form-grid">
                  <input type="text" name="name" placeholder="Your name" aria-label="Your name" />
                  <input type="email" name="email" placeholder="Your email" aria-label="Your email" />
                  <input type="text" name="subject" placeholder="Subject" aria-label="Subject" />
                  <textarea name="message" placeholder="Tell us what you need" aria-label="Message" />
                  <button className="button gold" type="submit">
                    <Send size={18} aria-hidden="true" />
                    Send message
                  </button>
                </form>
              </article>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
