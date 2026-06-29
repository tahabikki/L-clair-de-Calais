interface Business {
  name: string;
  type: string;
  address: string;
  phone: string;
  email: string;
  facebook: string;
  mapUrl: string;
  hours: [string, string][];
}

export const business: Business = {
  name: "L'Eclair de Calais",
  type: "Patisserie & boulangerie",
  address: "52 Rue de Thermes, 62100 Calais, France",
  phone: "+33 3 74 73 88 44",
  email: "eclairdecalais@gmail.com",
  facebook: "https://www.facebook.com/leclairdecalais",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=52%20Rue%20de%20Thermes%2C%2062100%20Calais%2C%20France",
  hours: [
    ["Sunday", "07:00-19:30"],
    ["Monday", "07:00-19:30"],
    ["Tuesday", "07:00-19:30"],
    ["Wednesday", "Closed"],
    ["Thursday", "07:00-19:30"],
    ["Friday", "07:00-19:30"],
    ["Saturday", "07:00-19:30"]
  ]
};
