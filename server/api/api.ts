import { Request, Response, Express } from 'express'
import { Database } from '../database/database'

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
  //Erstellt den User und speichert in DB
  private createUser = async (req: Request, res: Response) => {
    const { name, password } = req.body

    const result = await this.db.executeSQL(
      `INSERT INTO users (name, password) VALUES ('${name}', '${password}')`
    )

    res.json({
      user_id: result.insertId
    });
  }
}
