import { describe, expect, test, vi, afterEach } from "vitest"
import request from "supertest"
import { app } from '../index'

afterEach(() => {
    vi.unstubAllGlobals()
})

describe('Currency API tests',() => {
    test('POST /api/convert/amount return 200 for stubbed exchange rate',async () => {
        vi.stubGlobal('fetch',vi.fn().mockResolvedValue({
            ok: true,
            json: async() => ({ rates: {USD: 1.5}})
        }))

        const response = await request(app)
            .post('/api/convert/amount')
            .send({from: 'EUR',to: 'USD',amount: 100 })

        expect(response.status).toBe(200)
        expect(response.body.amount).toBe(150)
    })


    test('POST /api/convert/amount returns 200 for converted amount', async () => {
        const response = await request(app)
            .post('/api/convert/amount')
            .send({from: 'EUR',to: 'SEK', amount: 100 })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('amount')
        expect(typeof response.body.amount).toBe('number')
    })

    test('POST /api/convert/amount returns 400 for invalid currency code', async () => {
        const response = await request(app)
            .post('/api/convert/amount')
            .send({from: 'INVALID', to: 'USD', amount: 100 })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('error')
    })
})