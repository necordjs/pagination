<div align="center">
   <h1>
       <a href="#"><img src="https://necord.org/img/logo.png"></a>
   </h1>
  📜 A lightweight Pagination module for <b><a href="https://necord.org/">Necord</a></b>
   <br/><br/>
   <a href="https://necord.org">Documentation ✨</a> &emsp; <a href="https://github.com/SocketSomeone/necord">Source code 🪡</a> &emsp; <a href="https://github.com/necordjs/samples">Examples 🛠️</a> &emsp; <a href="https://discord.gg/mcBYvMTnwP">Community 💬</a>
</div>


<br/>

<p align="center">
    <a href='https://img.shields.io/npm/v/necord'><img src="https://img.shields.io/npm/v/necord" alt="NPM Version" /></a>
    <a href='https://img.shields.io/npm/l/necord'><img src="https://img.shields.io/npm/l/necord" alt="NPM License" /></a>
    <a href='https://img.shields.io/npm/dm/necord'><img src="https://img.shields.io/npm/dm/necord" alt="NPM Downloads" /></a>
    <a href='https://img.shields.io/github/last-commit/necordjs/necord'><img src="https://img.shields.io/github/last-commit/SocketSomeone/necord" alt="Last commit" /></a>
</p>

## About

Certainly! Pagination is a useful technique employed in user interfaces to present large amounts of information in a structured and
manageable way. When dealing with substantial volumes of data, such as search results, articles, or product listings, presenting it all at
once can overwhelm users and lead to a poor user experience. Pagination allows you to divide the information into smaller, organized chunks,
enhancing user engagement and ease of navigation. This module allows you to create a pagination with a few lines of code.

## Installation

**Node.js 16.6.0 or newer is required.**

```bash
$ npm i @necord/pagination necord discord.js
$ yarn add @necord/pagination necord discord.js
$ pnpm add @necord/pagination necord discord.js
```

## Usage

Once the installation process is complete, we can import the `NecordPaginationModule` with your `NecordModule` into the root `AppModule`:

```typescript
import { NecordModule } from 'necord';
import { Module } from '@nestjs/common';
import { NecordPaginationModule } from '@necord/pagination';
import { AppService } from './app.service';

@Module({
    imports: [
        NecordModule.forRoot({
            token: 'DISCORD_BOT_TOKEN',
            intents: ['Guilds', 'GuildMessages', 'DirectMessages']
        }),
        NecordPaginationModule.forRoot({
            // Change your buttons appearance
            buttons: {},
            // Add buttons for skip to first and last page
            allowSkip: true,
            // Add buttons for search page
            allowTraversal: true
        })
    ],
    providers: [AppService]
})
export class AppModule {
}
```

Then, we can inject the `PaginationService` into our service and register a pagination handler:

```typescript
import { OnModuleInit, Injectable } from '@nestjs/common';
import { NecordPaginationService, PageBuilder } from '@necord/pagination';
import { Context, SlashCommand, SlashCommandContext } from 'necord';

@Injectable()
export class AppService implements OnModuleInit {
    public constructor(private readonly paginationService: NecordPaginationService) {
    }

    public onModuleInit(): void {
        return this.paginationService.register(builder =>
            builder
                // Required, need for search your builder
                .setCustomId('test')
                // First way to set pages
                .setPages([
                    new PageBuilder().setContent('Page 1'),
                    new PageBuilder().setContent('Page 2'),
                    new PageBuilder().setContent('Page 3'),
                    new PageBuilder().setContent('Page 4'),
                    new PageBuilder().setContent('Page 5')
                ])
                // Second way, you can manually set pages using `setPages` method
                .setPagesFactory(page => new PageBuilder().setContent(`Page ${page}`))
                // Optional, only if you want to use pages factory
                .setMaxPages(5)
        );
    }

    @SlashCommand({ name: 'pagination', description: 'Test pagination' })
    public async onPagination(@Context() [interaction]: SlashCommandContext) {
        const pagination = this.paginationService.get('test');
        const page = await pagination.build();

        return interaction.reply(page);
    }
}
```

Congratulations! You have successfully created your first pagination!
Just use `pagination` command and you will see your pagination!

## Backers

<a href="https://opencollective.com/necord" target="_blank"><img src="https://opencollective.com/necord/backers.svg?width=1000"></a>

## Stay in touch

* Author - [Alexey Filippov](https://t.me/socketsomeone)
* Twitter - [@SocketSomeone](https://twitter.com/SocketSomeone)

## License

[MIT](https://github.com/necordjs/necord/blob/master/LICENSE) © [Alexey Filippov](https://github.com/SocketSomeone)
