import { Global, Module } from '@nestjs/common';

import { ConfigurableModuleClass } from './necord-pagination.module-definition.js';
import { NecordPaginationController } from './necord-pagination.controller.js';
import { NecordPaginationService } from './necord-pagination.service.js';

@Global()
@Module({
	providers: [NecordPaginationService, NecordPaginationController],
	exports: [NecordPaginationService]
})
export class NecordPaginationModule extends ConfigurableModuleClass {}
