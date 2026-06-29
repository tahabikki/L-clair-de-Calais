import { Cake, CalendarDays, Send } from "lucide-react";
import { Footer } from "@/components/Footer";
import { SiteNav } from "@/components/SiteNav";

export default function SpecialOrdersPage() {
  return (
    <main className="site-shell">
      <SiteNav />
      <section>
        <div className="container">
          <div className="section-head">
            <h2>Special orders</h2>
            <p>For birthdays, celebrations, corporate trays, and seasonal pastries, customers can send a request before visiting the shop.</p>
          </div>
          <div className="info-grid">
            <div className="category-grid">
              <article className="card contact-box">
                <Cake size={30} aria-hidden="true" />
                <h3>Celebration cakes</h3>
                <p>Birthday cakes, custom pastries, and dessert tables.</p>
              </article>
              <article className="card contact-box">
                <CalendarDays size={30} aria-hidden="true" />
                <h3>Plan ahead</h3>
                <p>Ask for date, quantity, flavor, size, and message details.</p>
              </article>
            </div>
            <form className="card contact-box form-grid">
              <input aria-label="Name" placeholder="Your name" />
              <input aria-label="Phone" placeholder="Phone number" />
              <select aria-label="Order type" defaultValue="">
                <option value="" disabled>Order type</option>
                <option>Birthday cake</option>
                <option>Custom pastries</option>
                <option>Corporate order</option>
                <option>Party tray</option>
              </select>
              <textarea aria-label="Order details" placeholder="Tell us the date, quantity, and idea" />
              <button className="button gold" type="button">
                <Send size={18} aria-hidden="true" />
                Prepare request
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
