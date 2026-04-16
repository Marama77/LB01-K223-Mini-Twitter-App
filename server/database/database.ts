import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'
import { USER_TABLE, TWEET_TABLE } from './schema'
import path from 'path'

//Klasse für DB-Zugriffe

export class SQLiteDatabase {
  private _db: Database | null = null
  
  // Constructor
  constructor() {
    this.initializeDatabase()
  }
  // Methods
  private initializeDatabase = async () => {
    try {
      // Create SQLite database in project root
      const dbPath = path.join(process.cwd(), 'minitwitter.db')
      this._db = await open({
        filename: dbPath,
        driver: sqlite3.Database
      })
      console.log('SQLite database connected successfully')
      await this.initializeDBSchema()
    } catch (error) {
      console.error('SQLite connection failed:', error instanceof Error ? error.message : String(error))
      throw error
    }
  }
  
  //Schema wird erstellt
  private initializeDBSchema = async () => {
    console.log('Initializing DB schema...')
    await this.executeSQL(USER_TABLE)
    await this.executeSQL(TWEET_TABLE)
  }
  
  //Query-Funktion - führt SQL aus und gibt Ergebnis zurück
  public executeSQL = async (query: string) => {
    if (!this._db) {
      throw new Error('Database not initialized')
    }
    
    try {
      if (query.trim().startsWith('SELECT')) {
        const results = await this._db.all(query)
        return results
      } else if (query.trim().startsWith('INSERT')) {
        const result = await this._db.run(query)
        return { insertId: result.lastID }
      } else {
        const result = await this._db.run(query)
        return result
      }
    } catch (err) {
      console.error('SQLite query failed:', err instanceof Error ? err.message : String(err))
      throw err
    }
  }
}

// Export as Database for compatibility
export { SQLiteDatabase as Database }
