/* eslint-disable no-console */
const GenerateConfirmToken = require('../middleware/GenerateToken');
const App = require('../app');
const request = require('supertest');

describe("Auth's Tests", () => {
    //TESTES DE UNIDADE
    it('Testing Generate Token', async () => {
        let Token = GenerateConfirmToken();
        expect(Token).not.toBe(0);
    });

    it('Testing how many repited tokens the system found', async () => {
        var y = [];
        var count = 0;
        for (var x = 0; x <= 100; x++) {
            let Token = GenerateConfirmToken();
            y.push(Token);
            for (var z = 0; z < x; z++) {
                if (y[x] == y[z]) {
                    console.log(y[x] + ' = ' + y[z]);
                    count++;
                }
            }
        }
        expect(count).toBe(0);
    });
    let EmailRandomString = Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substr(0, 7);

    //TESTES DE INTEGRAÇÃO
    it('Should Sign Up', async () => {
        const response = await request(App)
            .post('/auth/register')
            .send({
                UserName: 'Test',
                Email: EmailRandomString + '@test.com',
                Password: 'Test',
                BirthDate: '2000-12-12',
                PhoneNumber: '12345678901',
            });
        expect(response.body.message).toBe('Cadastro bem-sucedido');
    });

    it('Should Sign In', async () => {
        const response = await request(App)
            .post('/auth/authenticate')
            .send({
                Email: EmailRandomString + '@test.com',
                Password: 'Test',
            });
        expect(response.body.message).toBe('Sucesso no Login');
    });

    //TESTES DE SISTEMA
    it('Test if he cannot Sign up with the Same Email', async () => {
        const response = await request(App)
            .post('/auth/register')
            .send({
                UserName: 'Test2',
                Email: EmailRandomString + '@test.com',
                Password: 'Test2',
                BirthDate: '2000-11-11',
                PhoneNumber: '12345678901',
            });
        expect(response.body.Error).toBe('Este Email já foi cadastrado');
    });
});
