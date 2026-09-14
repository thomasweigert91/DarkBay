import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class OfferResponseDto {
  @ApiProperty()
  @Expose()
  id!: string;
  @ApiProperty()  
  @Expose()
  offer!: number;
  @ApiProperty()
  @Expose()
  offerDate!: Date;
}
