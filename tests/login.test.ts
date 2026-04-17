import request from 'supertest'
import express from 'express'
import Database from 'better-sqlite3'
import { API } from '../server/api/api'

// Build a fresh in-memory Express app for every test run
function buildApp() {
  const app = express()
  app.use(express.json())

  // In-memory SQLite database – discarded after tests finish
  const db = new Database(':memory:')
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      password TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS tweets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL
    );
    INSERT INTO users (name, password) VALUES ('testuser', 'testpass');
  `)

  // Wrap better-sqlite3 so it matches the executeSQL interface used by API
  const dbWrapper = {
    executeSQL: (query: string) => {
      if (query.trim().startsWith('SELECT')) {
        return db.prepare(query).all()
      } else if (query.trim().startsWith('INSERT')) {
        const result = db.prepare(query).run()
        return { insertId: result.lastInsertRowid }
      } else {
        return db.prepare(query).run()
      }
    }
  }

  new API(app, dbWrapper as any)
  return app
}

const app = buildApp()

describe('Login API', () => {
  test('POST /login – valid credentials returns user_id', async () => {
    const res = await request(app)
      .post('/login')
      .send({ name: 'testuser', password: 'testpass' })

    expect(res.status).toBe(200)
    expect(res.body.user_id).toBeDefined()
  })

  test('POST /login – wrong password returns 401', async () => {
    const res = await request(app)
      .post('/login')
      .send({ name: 'testuser', password: 'wrongpass' })

    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Invalid username or password')
  })
})

describe('Register API', () => {
  test('POST /users – creates a new user and returns user_id', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'newuser', password: 'newpass' })

    expect(res.status).toBe(200)
    expect(res.body.user_id).toBeDefined()
  })
})

describe('Tweet API', () => {
  test('POST /tweets – creates a tweet and returns 201', async () => {
    const res = await request(app)
      .post('/tweets')
      .send({ user_id: 1, content: 'Hello Twitter!' })

    expect(res.status).toBe(201)
  })
})

describe('Hello API', () => {
  test('GET /hello – returns greeting', async () => {
    const res = await request(app).get('/hello')

    expect(res.status).toBe(200)
    expect(res.text).toBe('Hello There!')
  })
})