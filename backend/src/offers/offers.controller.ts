import {
  Controller,
  Post,
  Body,
  Param,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OfferResponseDto } from './dto/offer-reponse.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('auctions/:id/offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @SerializeOptions({ type: OfferResponseDto })
  @UseGuards(AuthGuard)
  @Post()
  create(@Param('id') auctionId: string, @Body() createOfferDto: CreateOfferDto, @CurrentUser("id") userId: string) {
    return this.offersService.create(auctionId, createOfferDto, userId);
  }
}
