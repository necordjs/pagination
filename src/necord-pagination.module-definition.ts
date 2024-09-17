import { ConfigurableModuleBuilder } from '@nestjs/common';
import { NecordPaginationOptions } from './interfaces';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
	new ConfigurableModuleBuilder<NecordPaginationOptions>()
		.setClassMethodName('forRoot')
		.setFactoryMethodName('createNecordPaginationOptions')
		.build();
