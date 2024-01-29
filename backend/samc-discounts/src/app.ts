import { 
  APIGatewayProxyEvent, 
  APIGatewayProxyResult } 
from "aws-lambda/trigger/api-gateway-proxy";
import { MongoClient } from "mongodb";
interface Business {
  name: string;

  websites?: string[];
}

Object.defineProperty(exports, "__esModule", { value: true });
const client = new MongoClient(process.env.MONGODB_URI);
export const lambdaHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("hello!!!");
  const databases = await client.db("admin").command({ listDatabases: 1 });
  return {
    statusCode: 200,
    body: databases,
  };
}