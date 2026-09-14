import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  IsDate,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuctionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  startingPrice!: number;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;
}
