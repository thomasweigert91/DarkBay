import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SerializeOptions,
} from "@nestjs/common";
import { WatchlistsService } from "./watchlists.service";
import { CreateWatchlistDto } from "./dto/create-watchlist.dto";
import { UpdateWatchlistDto } from "./dto/update-watchlist.dto";
import { AuthGuard } from "src/auth/auth.guard";
import { CurrentUser } from "src/auth/current-user.decorator";
import { WatchlistResponseDto } from "./dto/watchlist-response.dto";

@UseGuards(AuthGuard)
@Controller("watchlist")
export class WatchlistsController {
  constructor(private readonly watchlistsService: WatchlistsService) {}

  @SerializeOptions({ type: WatchlistResponseDto })
  @Get()
  getMyWatchlist(@CurrentUser("id") userId: string) {
    return this.watchlistsService.getOrCreate(userId);
  }

  @SerializeOptions({ type: WatchlistResponseDto })
  @Post("auctions/:auctionId")
  addAuction(
    @CurrentUser("id") userId: string,
    @Param("auctionId") auctionId: string,
  ) {
    return this.watchlistsService.addAuction(userId, auctionId);
  }

  @SerializeOptions({ type: WatchlistResponseDto })
  @Delete("auctions/:auctionId")
  removeAuction(
    @CurrentUser("id") userId: string,
    @Param("auctionId") auctionId: string,
  ) {
    return this.watchlistsService.removeAuction(userId, auctionId);
  }
}
