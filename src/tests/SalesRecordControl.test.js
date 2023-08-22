const App = require('../app');
const request = require('supertest');

describe('Sales Record Tests', () => {
    it('Should Create a New Record', async () => {
        const result = await request(App)
            .post('/SalesRecord/newRecord')
            .send({
                TotalBuyPrice: 67,
                MoneyPayed: 67,
                PayBack: 0,
                userId: 1,
                ProductId: [1],
                Amount: [1],
                Weight: [1],
            });
        expect(result.body.message).toBe('Success on Create');
    });

    it('Should Find One Record', async () => {
        const result = await request(App).post('/SalesRecord/getOne').send({
            id: 1,
            userId: 1,
        });
        expect(
            result.body.message != 'Cannot Find any register at this time'
        ).toBeTruthy();
    });
});
