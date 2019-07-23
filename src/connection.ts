import { createConnection } from 'mongoose';
import IConnections from './IConnections';

let connectionPool: Array<IConnections>;
export function pool(connect: Array<IConnections>) {
  connectionPool = connect;
  return connectionPool;
}
export { connectionPool };
