import { IsString, MaxLength, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAuctionDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(120)
  title?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;
}
