import { Global, Module } from '@nestjs/common';

import { ConfigurableModuleClass } from './necord-pagination.module-definition';
import { NecordPaginationController } from './necord-pagination.controller';
import { NecordPaginationService } from './necord-pagination.service';

@Global()
@Module({
	providers: [NecordPaginationService, NecordPaginationController],
	exports: [NecordPaginationService]
})
export class NecordPaginationModule extends ConfigurableModuleClass {}
