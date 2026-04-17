import express, { NextFunction, Express, Request, Response } from 'express'
import { API } from './api'
import * as http from 'http'
import { resolve, dirname } from 'path'
import { Database } from './database'
import jwt from 'jsonwebtoken'

class AuthMiddleware {
  authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'Token missing' })
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' })
      }

      ;(req as any).user = decoded
      next()
    })
  }
}

export const authMiddleware = new AuthMiddleware()

class Backend {
  // Properties
  private _app: Express
  private _api: API
  private _database: Database
  private _env: string

  // Getters
  public get app(): Express {
    return this._app
  }

  public get api(): API {
    return this._api
  }

  public get database(): Database {
    return this._database
  }

  // Constructor
  constructor() {
    this._app = express()
    this._app.use(express.json())
    this._database = new Database()
    this._api = new API(this._app, this._database)
    this._env = process.env.NODE_ENV || 'development'

    this.setupStaticFiles()
    this.setupRoutes()
    this.startServer()
  }

  // Methods
  private setupStaticFiles(): void {
    this._app.use(express.static('client'))
  }

  private setupRoutes(): void {
    this._app.get('/', (req: Request, res: Response) => {
      const __dirname = resolve(dirname(''))
      res.sendFile(__dirname + '/client/index.html')
    })
  }

  private startServer(): void {
      http.createServer(this.app).listen(3000, () => {
        console.log('Server is listening!')
      })
    }
  }


const backend = new Backend()
export const viteNodeApp = backend.app
