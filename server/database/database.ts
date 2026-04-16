import mariadb from 'mariadb'
import { Pool } from 'mariadb'
import { USER_TABLE, TWEET_TABLE } from './schema'

//Klasse für DB-Zugriffe

export class Database {
  // Properties
  private _pool: Pool
  // Constructor
  constructor() {
    //Pool für mehrere Verbindungen
    this._pool = mariadb.createPool({
      database: process.env.DB_NAME || 'minitwitter',
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'minitwitter',
      password: process.env.DB_PASSWORD || 'supersecret123',
      connectionLimit: 5,
    })
    this.initializeDBSchema()
  }
  // Methods
  //Schema wird erstellt
  private initializeDBSchema = async () => {
    console.log('Initializing DB schema...')
    await this.executeSQL(USER_TABLE)
    await this.executeSQL(TWEET_TABLE)
  }
  
  //Query-Funktion - holt Verbindung, führt SQL aus, gibt Ergebnis zurück
  public executeSQL = async (query: string) => {
    try {
      const conn = await this._pool.getConnection()
      const res = await conn.query(query)
      conn.release()
      return res
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}
