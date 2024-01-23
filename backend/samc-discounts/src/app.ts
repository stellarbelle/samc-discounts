import { 
  APIGatewayProxyEvent, 
  APIGatewayProxyResult } 
from "aws-lambda/trigger/api-gateway-proxy";

interface Business {
  name: string;
  category: string;
  discount: string;
  location?: { lat: number; lng: number };
  address?: string;
  dist?: number;
  phoneNumbers?: string[];
  emailAddresses?: string[];
  websites?: string[];
}

export const lambdaHandler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const Business: business = JSON.parse(event.body);
  return {
    statusCode: 200,
    body: JSON.stringify({'business' : Business})
  }
}