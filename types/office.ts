export interface ElectedRoleInfo {
  quantity: number;
  prize: number;
}

export interface ElectedRoles {
  politikozElected: Record<string, ElectedRoleInfo>;
  ticketElected: Record<string, ElectedRoleInfo>;
  totalPrize: number;
}