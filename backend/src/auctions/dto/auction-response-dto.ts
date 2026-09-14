import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { OfferResponseDto } from "src/offers/dto/offer-reponse.dto";

export class AuctionResponseDto {
  @ApiProperty()
  @Expose()
  id!: string;
  @ApiProperty()
  @Expose()
  title!: string;
  @ApiProperty()
  @Expose()
  description!: string;
  @ApiProperty()
  @Expose()
  startingPrice!: number;
  @ApiProperty()
  @Expose()
  currentPrice!: number;
  @ApiProperty()
  @Expose()
  sellerId!: string;
  @ApiProperty()
  @Expose()
  startDate!: Date;
  @ApiProperty()
  @Expose()
  endDate!: Date;
  @Expose()
  @Type(() => OfferResponseDto)
  offers!: OfferResponseDto[];
}
