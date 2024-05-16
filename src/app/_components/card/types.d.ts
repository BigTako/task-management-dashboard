import { Column } from "@prisma/client";

export interface CardType {
  id: string;
  title: string;
  description: string;
  column: Column;
  createdAt: Date;
}
