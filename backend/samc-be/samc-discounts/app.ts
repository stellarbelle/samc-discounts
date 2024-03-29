import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
interface Person {
    name: string;
    surname: string;
    age: number;
}
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const person: Person = JSON.parse(event.body as string);
    return {
        statusCode: 200,
        body: JSON.stringify({ Person: person }),
    };
};
