import { enablePromise, openDatabase, SQLiteDatabase } from "react-native-sqlite-storage";

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase({ name: "mydb.db", location: "default" });
};

export const createTable = async (db: SQLiteDatabase) => {
    const query = `CREATE TABLE IF NOT EXISTS hosts (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        mac TEXT NOT NULL,
        sync_time TEXT NOT NULL
    );`
    await db.executeSql(query);
};

export const insertHost = async (db: SQLiteDatabase, id: number, name: string, mac: string, sync_time: string) => {
    const query = `INSERT INTO hosts (id, name, mac, sync_time) VALUES (?, ?, ?, ?);`;
    const params = [id, name, mac, sync_time];
    await db.executeSql(query, params);
};

export const selectHosts = async (db: SQLiteDatabase) => {
    const query = `SELECT * FROM hosts;`;
    const [results] = await db.executeSql(query);
    const hosts = results.rows.raw();
    return hosts;
};

export const deleteTable = async (db: SQLiteDatabase) => {
    const query = `drop table hosts`;
  
    await db.executeSql(query);
};