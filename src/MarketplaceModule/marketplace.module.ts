import { Module } from '@nestjs/common';
import { ItemService } from './service/item.service';
import { ItemController } from './controller/item.controller';

@Module({
  imports: [],
  controllers: [ItemController],
  providers: [ItemService],
})
export class MarketplaceModule {}
