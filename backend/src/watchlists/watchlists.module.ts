import { Module } from '@nestjs/common';
import { WatchlistsService } from './watchlists.service';
import { WatchlistsController } from './watchlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Watchlist } from './entities/watchlist.entity';
import { Auction } from 'src/auctions/entities/auction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Watchlist, Auction])],
  controllers: [WatchlistsController],
  providers: [WatchlistsService],
})
export class WatchlistsModule {}
