import { Expose, Type } from "class-transformer";

import { AuctionResponseDto } from "./auction-response-dto";
import { ApiProperty } from "@nestjs/swagger";

export class PaginatedAuctionResponseDto {
  @ApiProperty()
  @Expose()
  @Type(() => AuctionResponseDto)
  data!: AuctionResponseDto[];
  @ApiProperty()
  @Expose()
  meta!: {
    totalItems?: number;
    itemCount?: number;
    itemsPerPage?: number;
    totalPages?: number;
    currentPage?: number;
  };
}
