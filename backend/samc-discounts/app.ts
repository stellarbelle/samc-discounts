import { Context, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
interface Person {
    name: string;
    surname: string;
    age: number;
}
export const lambdaHandler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
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
