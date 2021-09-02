const App =require("../app");
const request = require("supertest");

describe("Auth's Tests",()=>{
    it('Should Respond', async ()=>{
        const respose = await request(App)
        .get('/auth/test')

        expect(200)
    })
    
})