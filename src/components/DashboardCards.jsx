import { People, BoxSeam, CurrencyDollar, Cart3 } from "react-bootstrap-icons";

import "./DashboardCards.css";

const cards = [
  {
    title: "Usuarios",
    value: "1,248",
    percentage: "+12.5%",
    description: "vs. mes anterior",
    icon: People,
    type: "primary",
    positive: true,
  },
  {
    title: "Productos",
    value: "856",
    percentage: "+8.2%",
    description: "vs. mes anterior",
    icon: BoxSeam,
    type: "success",
    positive: true,
  },
  {
    title: "Ventas",
    value: "$24.580.000",
    percentage: "+15.4%",
    description: "vs. mes anterior",
    icon: CurrencyDollar,
    type: "warning",
    positive: true,
  },
  {
    title: "Pedidos",
    value: "328",
    percentage: "-3.1%",
    description: "vs. mes anterior",
    icon: Cart3,
    type: "danger",
    positive: false,
  },
];

function DashboardCards() {
  return (
    <div className="dashboard-cards">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div className="dashboard-card" key={card.title}>
            {/* Parte superior */}
            <div className="card-header">
              <div className={`card-icon ${card.type}`}>
                <Icon size={22} />
              </div>

              <span className="card-title">{card.title}</span>
            </div>

            {/* Valor */}
            <div className="card-value">{card.value}</div>

            {/* Estadística */}
            <div className="card-footer">
              <span
                className={
                  card.positive ? "percentage positive" : "percentage negative"
                }
              >
                {card.positive ? "↑" : "↓"} {card.percentage}
              </span>

              <span className="card-description">{card.description}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DashboardCards;
