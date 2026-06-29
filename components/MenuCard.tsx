import Image from "next/image";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  available: boolean;
  tag?: string;
  featured?: boolean;
  categoryId?: string;
  order?: number;
}

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  return (
    <article className="menu-card" data-reveal>
      <div className="menu-card-media">
        <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 100vw, 33vw" />
        {item.tag ? <span className="menu-card-tag">{item.tag}</span> : null}
        <span className="menu-card-price">{item.price}</span>
        {!item.available ? <span className="menu-card-soldout">Indisponible</span> : null}
      </div>
      <div className="menu-card-body">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <div className="menu-card-footer">
          <span className={`availability-dot ${item.available ? "is-available" : "is-unavailable"}`} aria-hidden="true" />
          <span>{item.available ? "Disponible aujourd'hui" : "Bientot de retour"}</span>
        </div>
      </div>
    </article>
  );
}
