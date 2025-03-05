import Realm, {BSON} from "realm";

export class Host extends Realm.Object<Host> {
    _id!: BSON.ObjectId;
    device_name!: string;
    mac_address!: string;
    last_sync!: Date;

    static schema: Realm.ObjectSchema = {
        name: "Host",
        primaryKey: "_id",
        properties: {
            _id: "objectId",
            device_name: "string",
            mac_address: "string",
            last_sync: "date"
        }
    }
}