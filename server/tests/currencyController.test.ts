import { describe,expect, test,vi } from "vitest"
import { convertAmount } from "../controllers/currencyController"

vi.mock('../services/currencyService', () => ({
    convert: vi.fn().mockResolvedValue({ amount: 9 })
}))

const createMockResponse = () => {
    const res: any = {}
    res.status = vi.fn().mockReturnThis()
    res.json = vi.fn()
    return res
}

describe('CurrencyController.convertAmount',() => {
    test('Return conversion with valid request', async () => {
        const req: any = { body: { from:'EUR',to: 'SEK',amount: 10}}
        const res = createMockResponse()

        await convertAmount(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ amount: 9 })
    })

    test('Return 400 for invalid currency code', async () => {
        const req: any = { body: { from:'EU',to: 'SEK',amount: 10}}
        const res = createMockResponse()

        await convertAmount(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(
          { error:
            'Currency codes must be 3-letter ISO abbreviations (e.g., USD, EUR).'
          }
        )
    })

    test('Return 400 for empty currency code', async () => {
        const req: any = { body: { from:'',to: 'SEK',amount: 10}}
        const res = createMockResponse()

        await convertAmount(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(
          { error:
            'Body parameters "from" and "to" are required.'
          }
        )
    })

    test('Return 400 for negative amount', async () => {
        const req: any = { body: { from: 'EUR', to: 'SEK', amount: -10 }}
        const res = createMockResponse()

        await convertAmount(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(
          { error:
            'Amount must be greater than zero.'
          }
        )
    })
})

