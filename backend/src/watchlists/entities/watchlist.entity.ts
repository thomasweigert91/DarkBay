import { Auction } from "src/auctions/entities/auction.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("watchlists")
export class Watchlist { 
	@PrimaryGeneratedColumn('uuid')
    id!: string;
    
    @Column()
    userId!: string;

    @OneToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user!: User
    
	@ManyToMany(() => Auction, { onDelete: 'CASCADE'})
	@JoinTable({ name: 'watchlist_auctions', joinColumn: { name: 'watchlistId', referencedColumnName: 'id' }, inverseJoinColumn: {name: "auctionId", referencedColumnName: "id"} })
	auctions!: Auction[];
}
