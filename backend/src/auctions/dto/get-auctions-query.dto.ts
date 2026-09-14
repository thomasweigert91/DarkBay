import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from "class-validator";

export enum AuctionStatus {
  OPEN = "open",
  CLOSED = "closed",
}

export class GetAuctionsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional()
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit: number = 10;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(AuctionStatus)
  status?: AuctionStatus;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  minPrice?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxPrice?: number;
}
