import { Expose, Type } from "class-transformer";
import { AuctionResponseDto } from "src/auctions/dto/auction-response-dto";
import { Auction } from "src/auctions/entities/auction.entity";

export class WatchlistResponseDto {
  @Expose()
  id!: string;

  @Expose()
  @Type(() => AuctionResponseDto)
  auctions!: AuctionResponseDto[];
}
