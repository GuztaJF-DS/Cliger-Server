const App =require('../app');
const request = require('supertest');

describe("Finance's Tests",()=>{
    it('Should Create a New Record',async()=>{
        const result=await request(App)
        .post('/finance/register')
        .send({
            CurrentBalance:20,
            userId:1
        })
        expect(result.body.message).toBe("Success on Create");
    })

    it('Shoud Find All Records',async()=>{
        const result=await request(App)
        .post('/finance/getAll')
        .send({
            userId:1
        })
        expect(result.body.Error!="Couldn't Get the Data").toBeTruthy()
    })
})