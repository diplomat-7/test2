## Description

Framer by SPLYD, developed using [Nest](https://github.com/nestjs/nest) framework.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Migration

The project uses [Sequelize](https://sequelize.org/docs/v6/other-topics/migrations/#creating-the-first-model-and-migration) migration for database table creation and updates.

```bash
# create a migration file. This would create a new file in the database/migrations folder
$ npx sequelize-cli migration:generate --name xxxxx-name-of-migration-like-create-user-table

# run the migration
$ npm run migration
```

## License

Nest is [MIT licensed](LICENSE).
