import { Global, Module } from '@nestjs/common';
import { NecordPaginationService } from './necord-pagination.service';
import { NecordPaginationController } from './necord-pagination.controller';
import { ConfigurableModuleClass } from './necord-pagination.module-definition';

@Global()
@Module({
	providers: [NecordPaginationService, NecordPaginationController],
	exports: [NecordPaginationService]
})
export class NecordPaginationModule extends ConfigurableModuleClass {}
