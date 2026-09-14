import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Watchlist } from "./entities/watchlist.entity";
import { Repository } from "typeorm";
import { Auction } from "src/auctions/entities/auction.entity";

@Injectable()
export class WatchlistsService {
  constructor(
    @InjectRepository(Watchlist)
    private readonly watchlistRepository: Repository<Watchlist>,
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
  ) {}

  async getOrCreate(userId: string): Promise<Watchlist> {
    let watchlist = await this.watchlistRepository.findOne({
      where: { userId },
      relations: { auctions: true },
    });

    if (!watchlist) {
      watchlist = this.watchlistRepository.create({ userId, auctions: [] });
      watchlist = await this.watchlistRepository.save(watchlist);
    }

    if (!watchlist.auctions) {
      watchlist.auctions = [];
    }

    return watchlist;
  }

  async addAuction(userId: string, auctionId: string) {
    const watchlist = await this.getOrCreate(userId);

    const auction = await this.auctionRepository.findOne({
      where: { id: auctionId },
    });

    if (!auction) {
      throw new NotFoundException(`Auction ${auctionId} not found.`);
    }

    const alreadyOnList = watchlist.auctions.some((a) => a.id === auctionId);
    if (alreadyOnList) {
      return watchlist;
    }

    watchlist.auctions.push(auction);
    return await this.watchlistRepository.save(watchlist);
  }

  async removeAuction(userId: string, auctionId: string) {
    const watchlist = await this.getOrCreate(userId);

    watchlist.auctions = watchlist.auctions.filter((a) => a.id !== auctionId);

    return await this.watchlistRepository.save(watchlist);
  }
}
