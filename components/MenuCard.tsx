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
      <Image src={item.image} alt={item.name} width={720} height={540} />
      <div className="menu-card-body">
        {item.tag ? <span className="tag">{item.tag}</span> : null}
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <div className="price-row">
          <span>{item.available ? "Disponible" : "Temporairement indisponible"}</span>
          <strong>{item.price}</strong>
        </div>
      </div>
    </article>
  );
}
