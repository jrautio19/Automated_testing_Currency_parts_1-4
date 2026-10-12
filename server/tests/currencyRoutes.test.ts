import { describe,expect, test, vi } from 'vitest'
import request from 'supertest'
import { app } from '../index'
import * as convertUtils from '../utils/convert'

describe('Currency routes',() => {
    test('POST /api/convert/amount returns converted amount', async () => {
        vi.spyOn(convertUtils, 'calculateConversion').mockReturnValue(9)
        
        const res = await request(app)
            .post('/api/convert/amount')
            .send({ from: 'EUR', to: 'SEK', amount: 10 })

        expect(res.status).toBe(200)
        expect(res.body).toEqual({ amount: 9 })
        expect(convertUtils.calculateConversion).toHaveBeenCalledWith(10, 0.9)
    })

    test('POST /api/convert/amount returns 400 for invalid currency', async () => {
        const res = await request(app)
            .post('/api/convert/amount')
            .send({ from: 'EU', to: 'SEK', amount: 10 })

        expect(res.status).toBe(400)
        expect(res.body.error).toBeDefined()
    })
})
