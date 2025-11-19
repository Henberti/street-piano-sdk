import { IPublishPacket } from 'mqtt';

type SubCB = (topic: string, payload: Buffer, packet: IPublishPacket) => void;

interface ClinetInfo {
    username: string;
    password: string;
    broker: string;
    port: number;
    connection_timeout?: number;
}

/**
 *
 * @param clientInfo client info that you got from street-piano
 * @param piano_id the specific piano id you got
 * @param cb callback function when a new message is comming
 * @param shared if you want to use shared subscription you can run multipule clients with the same consumer group
 * @param consumer_group this reqiures when shared to be true, the name of the consumer group
 */
declare function initializeClient(clientInfo: ClinetInfo, piano_id: string, cb: SubCB, shared?: boolean, consumer_group?: string): Promise<void>;

export { type ClinetInfo, type SubCB, initializeClient };
