import 'reflect-metadata';
import path from 'path';
import { createConnection } from 'typeorm';

export default async function startConnection() {
  return createConnection({
    type: 'sqlite',
    database: path.resolve(__dirname, process.env.DATABASE_NAME),
    synchronize: true,
    logging: true,
    entities: [path.resolve(__dirname, 'entities', '**', '*.ts')],

    // eslint-disable-next-line no-console
  }).catch((error) => console.error(error));
}
