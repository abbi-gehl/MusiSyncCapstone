import Realm, { ObjectSchema } from "realm";

export class Client extends Realm.Object<Client> {
    _id!: number;
    name!: string;
    address!: string;
    lastSync!: string;

    static schema: ObjectSchema = {
        name: 'Client',
        properties: {
            _id: {type: 'int', indexed: true},
            name: 'string',
            address: 'string',
            lastSync: 'string'
        },
        primaryKey: '_id'
    };
}