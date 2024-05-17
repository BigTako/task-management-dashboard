import { CardType } from '../card';

export interface BoardType {
  id: string;
  name: string;
  cards: CardType[];
  createdAt: Date;
}
