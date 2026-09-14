import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Auction } from './entities/auction.entity';
import {
  AuctionStatus,
  GetAuctionsQueryDto,
} from './dto/get-auctions-query.dto';
import { Between } from 'typeorm';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectRepository(Auction)
    private readonly auctionsRepository: Repository<Auction>,
  ) {}

  async create(createAuctionDto: CreateAuctionDto, userId: string) {
    const auction = this.auctionsRepository.create({
      ...createAuctionDto,
      sellerId: userId,
    });

    const savedAuction = await this.auctionsRepository.save(auction);

    return savedAuction;
  }

  async findAll(query: GetAuctionsQueryDto) {
    const { page = 1, limit = 10, status } = query;
    const minPrice = query.minPrice;
    const maxPrice = query.maxPrice;
    const now = new Date();

    const skip = (page - 1) * limit;
    const where: FindOptionsWhere<Auction> = {};

    if (status === AuctionStatus.OPEN) {
      where.endDate = MoreThan(now);
    } else if (status === AuctionStatus.CLOSED) {
      where.endDate = LessThanOrEqual(now);
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      where.currentPrice = Between(minPrice, maxPrice);
    } else if (minPrice !== undefined) {
      where.currentPrice = MoreThanOrEqual(minPrice);
    } else if (maxPrice !== undefined) {
      where.currentPrice = LessThanOrEqual(maxPrice);
    }

    const [data, totalItems] = await this.auctionsRepository.findAndCount({
      where,
      order: {
        endDate: 'DESC',
      },
      take: limit,
      skip,
    });

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: data,
      meta: {
        totalItems,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  async findOne(auctionId: string) {
    return await this.auctionsRepository.findOne({
      where: { id: auctionId },
      relations: {
        offers: true,
      },
    });
  }

  async update(id: string, updateAuctionDto: UpdateAuctionDto) {
    const auction = await this.auctionsRepository.preload({
      id,
      ...updateAuctionDto,
    });
    if (!auction) {
      throw new NotFoundException(`Auction #${id} not found`);
    }
    return await this.auctionsRepository.save(auction);
  }

  async remove(id: string) {
    const removed = await this.auctionsRepository.delete({ id });

    if (removed.affected == 0) {
      throw new NotFoundException('Auction not found');
    }

    return removed;
  }
}
