import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuctionsModule } from './auctions/auctions.module';
import { OffersModule } from './offers/offers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from './auctions/entities/auction.entity';
import { Offer } from './offers/entities/offer.entity';
import { User } from './users/entities/user.entity';
import { Middleware } from './middlewares/middleware';
import { Watchlist } from './watchlists/entities/watchlist.entity';
import { WatchlistsModule } from './watchlists/watchlists.module';

@Module({
  imports: [
    AuctionsModule,
    OffersModule,
    WatchlistsModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        if (process.env.DATABASE_URL) {
          return {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [Auction, Offer, User, Watchlist],
            synchronize: true,
          };
        }
        return {
          type: 'better-sqlite3',
          database: 'data/dark-bay.sqlite',
          entities: [Auction, Offer, User, Watchlist],
          synchronize: true,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Middleware).forRoutes('/auctions');
  }
}
