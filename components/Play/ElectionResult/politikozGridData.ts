export interface Politikoz {
    name: string;
    earnings: number;
    role: string;
    place: number;
  }
  
  const roleOrder = [
    "President",
    "Minister",
    "Governor",
    "Mayor",
    "Federal Deputy",
    "State Deputy",
    "Councilor",
  ];
  
  const generatePolitikoz = (
    nameIndex: number,
    earnings: number,
    role: string,
    place: number
  ): Politikoz => ({
    name: `#${String(nameIndex).padStart(5, "0")}`,
    earnings,
    role,
    place,
  });
  
  // 🔹 Mock de 3 grupos
  const winningPolitikoz: Politikoz[] = [
    generatePolitikoz(4651, 8000, "President", 1),
    generatePolitikoz(6922, 7500, "Governor", 2),
    generatePolitikoz(1168, 7000, "State Deputy", 3),
    generatePolitikoz(3032, 8200, "Minister", 4),
    generatePolitikoz(1408, 6800, "Councilor", 5),
    generatePolitikoz(3537, 8000, "President", 1),
    generatePolitikoz(8727, 7500, "Governor", 2),
    generatePolitikoz(1220, 7000, "State Deputy", 3),
    generatePolitikoz(1247, 8200, "Minister", 4),
    generatePolitikoz(9395, 6800, "Councilor", 5),
    generatePolitikoz(1791, 8000, "President", 1),
    generatePolitikoz(8573, 7500, "Governor", 2),
    generatePolitikoz(5692, 7000, "State Deputy", 3),
    generatePolitikoz(1411, 8200, "Minister", 4),
    generatePolitikoz(5902, 6800, "Councilor", 5),
  ];
  
  const outOfStaminaPolitikoz: Politikoz[] = [
    generatePolitikoz(9999, 8500, "Governor", 6),
    generatePolitikoz(8888, 9200, "Minister", 7),
    generatePolitikoz(7279, 8900, "President", 8),
    generatePolitikoz(7234, 9100, "Governor", 9),
  ];
  
  const losingPolitikoz: Politikoz[] = [
    generatePolitikoz(5902, 0, "Councilor", 10),
    generatePolitikoz(3213, 0, "Minister", 11),
    generatePolitikoz(3945, 0, "State Deputy", 12),
    generatePolitikoz(2222, 0, "Federal Deputy", 13),
    generatePolitikoz(1111, 0, "Governor", 14),
  ];
  
  // 🔹 Ordenação por Role > Earnings (decrescente) > Place (crescente)
  const sortPolitikoz = (a: Politikoz, b: Politikoz) => {
    const roleComparison = roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role);
    if (roleComparison !== 0) return roleComparison;
    if (b.earnings !== a.earnings) return b.earnings - a.earnings;
    return a.place - b.place;
  };
  
  export const PolitikozData = {
    winning: winningPolitikoz.sort(sortPolitikoz),
    outOfStamina: outOfStaminaPolitikoz.sort(sortPolitikoz),
    losing: losingPolitikoz.sort(sortPolitikoz),
  };
  