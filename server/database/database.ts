import Database from 'better-sqlite3'
import { USER_TABLE, TWEET_TABLE } from './schema'
import path from 'path'

//Klasse für DB-Zugriffe

export class SQLiteDatabase {
  private _db: Database.Database | null = null
  
  // Constructor
  constructor() {
    this.initializeDatabase()
  }
  // Methods
  private initializeDatabase = () => {
    try {
      // Create SQLite database in project root
      const dbPath = path.join(process.cwd(), 'minitwitter.db')
      this._db = new Database(dbPath)
      console.log('SQLite database connected successfully')
      this.initializeDBSchema()
    } catch (error) {
      console.error('SQLite connection failed:', error instanceof Error ? error.message : String(error))
      throw error
    }
  }
  
  //Schema wird erstellt
  private initializeDBSchema = () => {
    console.log('Initializing DB schema...')
    this.executeSQL(USER_TABLE)
    this.executeSQL(TWEET_TABLE)
  }
  
  //Query-Funktion - führt SQL aus und gibt Ergebnis zurück
  public executeSQL = (query: string) => {
    if (!this._db) {
      throw new Error('Database not initialized')
    }
    
    try {
      if (query.trim().startsWith('SELECT')) {
        const results = this._db.prepare(query).all()
        return results
      } else if (query.trim().startsWith('INSERT')) {
        const result = this._db.prepare(query).run()
        return { insertId: result.lastInsertRowid }
      } else {
        const result = this._db.prepare(query).run()
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
