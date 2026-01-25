export const errorResponse = (message: string , statusCode:number) => {
  return {
    success: false,
    statusCode: statusCode,
    message: message, 
    data: [],
  };
};