import 'reflect-metadata';
import { createConnection } from 'typeorm';

export default async function startConnection() {
  return createConnection().catch((error) => console.log(error));
}
