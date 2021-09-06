const App =require("../app");
const request = require("supertest");

describe("Auth's Tests",()=>{
    it('Should Respond', async ()=>{
        const response = await request(App)
        .get('/auth/test')

        expect(200)
    })
    
    it('Should Sign Up', async()=>{
        let EmailRandomString=Math.random().toString(36).replace(/[^a-z]+/g,'').substr(0,7);
        const response=await request(App)
        .post('/auth/register')
        .send({
            UserName:"Test",
            Email:EmailRandomString+"@test.com",
            Password:"Test",
            BirthDate:"2000-12-12",
            PhoneNumber:"12345678901"
        })

        expect(response.body.message).toBe("Cadastro bem-sucedido");
    })
})