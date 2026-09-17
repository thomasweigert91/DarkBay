import { Offer } from '../../offers/entities/offer.entity';
import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Entity,
  BeforeInsert,
  OneToMany,
} from 'typeorm';

@Entity('auctions')
export class Auction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  startingPrice!: number;

  @Column({ nullable: true })
  currentPrice!: number;

  @Column()
  sellerId!: string;

  @CreateDateColumn()
  startDate!: Date;

  @Column({ nullable: true })
  endDate!: Date;

  @OneToMany(() => Offer, (offer) => offer.auction)
  offers!: Offer[];

  @BeforeInsert()
  setEndDate() {
    if (!this.endDate) {
      const baseDate = this.startDate ? new Date(this.startDate) : new Date();
      this.endDate = new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000);
    }
  }

  @BeforeInsert()
  initializePrices() {
    if (this.currentPrice === undefined || this.currentPrice === null) {
      this.currentPrice = this.startingPrice;
    }
  }
}
