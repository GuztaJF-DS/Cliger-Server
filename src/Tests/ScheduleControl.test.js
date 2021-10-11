const App =require('../app');
const request = require('supertest');

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

let Hour=getRandomInt(10,23);
let Minute=getRandomInt(0,5);
let Year=getRandomInt(10,99);
let day=getRandomInt(10,28);

let ScheduledHour=`${Hour}:${Minute}0`;
let ScheduledDay=`20${Year}-04-${day}`;

describe("Schedule's Tests",()=>{
    it('Should Create a New Register',async()=>{
        const result=await request(App)
        .post('/schedule/register')
        .send({
            ScheduledDay:ScheduledDay,
            ScheduledHour:ScheduledHour,
            ClientName:"jobson",
            userId:1,
            ProSerId:[1,2]
        })
        expect(result.body.message).toBe("Success on Create");
    })

    it('Should Find This Record', async()=>{
        const result=await request(App)
        .post('/schedule/getOne')
        .send({
            ScheduledDay:ScheduledDay,
            ScheduledHour:ScheduledHour,
            userId:1,
        })
        expect(result.body.message!="Cannot Find any register at this time"||result.body.Error!="Couldn't Get the Data").toBeTruthy()
    })

    it('Shoud Find All Records of the Day',async()=>{
        const result=await request(App)
        .post('/schedule/getAllFromDay')
        .send({
            ScheduledDay:ScheduledDay,
            userId:1,
        })
        expect(result.body.Error!="Couldn't Get the Data").toBeTruthy()
    })

    it('Should Delete This Record', async()=>{
        const result=await request(App)
        .post('/schedule/delete/One')
        .send({
            ScheduledDay:ScheduledDay,
            ScheduledHour:ScheduledHour,
            userId:1,
        })
        expect(result.body.message).toBe("Shedule deleted")
    })
})