import { User } from 'src/users/entities/user.entity';
import { Auction } from '../../auctions/entities/auction.entity';
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  offer!: number;

  @CreateDateColumn()
  offerDate!: Date;

  @Column()
  auctionId!: string;
  @ManyToOne(() => Auction, (auction) => auction.offers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'auctionId' })
  auction!: Auction;

  @ManyToOne(() => User, (user) => user.offers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;
}
