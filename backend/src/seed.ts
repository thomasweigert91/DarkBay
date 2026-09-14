import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Auction } from './auctions/entities/auction.entity';
import { Offer } from './offers/entities/offer.entity';
import { User } from './users/entities/user.entity';

const dataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'data/dark-bay.sqlite',
  entities: [Auction, Offer],
  synchronize: true,
});

async function seed() {

 console.log('fire');
  await dataSource.initialize();
}
