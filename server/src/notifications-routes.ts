import WebPush from 'web-push'
import {FastifyInstance} from 'fastify'
import { z } from 'zod'

const publicKey = "BKt0BlRXProOgV0jPdcZrX-nA09sXJexwsIMeTK9z191XNQSFALst10zsvB7PyttEdJ3SC4-qZfguLyIXjjs9kk"
const privateKey = "DK_lMSpoonSpp6qB3K3yhZ9HsQVgueaHaLKslqjIBXc"

WebPush.setVapidDetails(
    'http://localhost:3333',
    publicKey,
    privateKey
)

export async function notificationRoutes(app: FastifyInstance){

    app.get('/push/public_key',()=>{
        return {
            publicKey,
        }
    })

    app.post('/push/register',(request,reply)=>{
        console.log(request.body)

        return reply.status(201).send()
    })

    app.post('/push/send',async (request,reply)=>{
        const sendPushBody = z.object({
            subscription: z.object({
                endpoint: z.string(),
                keys: z.object({
                    p256dh: z.string(),
                    auth: z.string(),
                }),
            }),
        })

        const {subscription} = sendPushBody.parse(request.body)

        WebPush.sendNotification(subscription,'Hello World')

        return reply.status(201).send()
    })
}

