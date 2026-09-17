import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Auction } from '../../auctions/entities/auction.entity';
import { Offer } from 'src/offers/entities/offer.entity';

@Entity('user')
export class User {
  @PrimaryColumn('text')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ default: false })
  emailVerified!: boolean;

  @Column({ nullable: true })
  image!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Auction, (auction) => auction.sellerId)
  auctions!: Auction[];

  @OneToMany(() => Offer, (offer) => offer.userId)
  offers!: Auction[];
}
