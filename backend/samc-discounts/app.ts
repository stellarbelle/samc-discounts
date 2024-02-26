import { Context, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_CONNECTION;

interface Person {
    name: string;
    surname: string;
    age: number;
}
export const lambdaHandler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    });

    console.log('connecting ...');
    try {
        await client.connect();
        console.log('connected!');
    } catch (e) {
        console.log('error!', e);
    } finally {
        console.log('closing ... ');
        await client.close();
        console.log('closed');
    }

    console.log(`Event: ${JSON.stringify(event, null, 2)}`);
    console.log(`Context: ${JSON.stringify(context, null, 2)}`);
    const person: Person = JSON.parse(event.body as string);
    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify({
            Person: person,
            message: 'hello world',
        }),
    };
    return response;
};
