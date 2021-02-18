import { Module } from '@nestjs/common';
import { InventoryService } from './service/inventory.service';
import { InventoryController } from './controller/inventory.controller';

@Module({
  imports: [],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class MarketplaceModule {}
