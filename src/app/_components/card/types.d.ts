import type { Column } from '@prisma/client';

export interface CardType {
  id: string;
  title: string;
  description: string;
  column: Column;
  position: number;
  boardId: string;
  createdAt: Date;
}
