import { Request, Response, Express } from 'express'
import { Database } from '../database/database'

//API-Klasse: Strukturiert die Backend-Logik & kapselt zusammengehörige Strukturen.
export class API {
  // Properties
  app: Express
  db: Database
  // Constructor
  constructor(app: Express, db: Database) {
    this.app = app
    this.db = db

    this.app.get('/hello', this.sayHello)
    this.app.post('/tweets', this.createTweet)
    this.app.post('/login', this.login)
    this.app.post('/users', this.createUser)
  }
  // Methods
  private sayHello(req: Request, res: Response) {
    res.send('Hello There!')
  }
  //Erstellt den Tweet und speichert in DB
  private createTweet = async (req: Request, res: Response) => {
    const { user_id, content } = req.body
  
    await this.db.executeSQL(
      `INSERT INTO tweets (user_id, content) VALUES (${user_id}, '${content}')`
    )
    //Status "created"
    res.sendStatus(201)
  }
  //Authentifiziert den User
  private login = async (req: Request, res: Response) => {
    const { name, password } = req.body

    try {
      const result = await this.db.executeSQL(
        `SELECT id FROM users WHERE name = '${name}' AND password = '${password}'`
      )
      
      if (result.length > 0) {
        res.json({
          user_id: result[0].id,
          name: result[0].name
        });
      } else {
        res.status(401).json({
          error: 'Invalid username or password'
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  //Erstellt den User und speichert in DB
  private createUser = async (req: Request, res: Response) => {
    const { name, password } = req.body

    try {
      const result = await this.db.executeSQL(
        `INSERT INTO users (name, password) VALUES ('${name}', '${password}')`
      )

      res.json({
        user_id: result.insertId
      });
    } catch (err) {
      console.error('Create user error:', err);
      res.status(500).json({
        error: 'Failed to create user'
      });
    }
  }
}
