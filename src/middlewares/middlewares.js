export const loggingMiddleware = async (request, reply) => {
    console.log(`Incoming request: ${request.method} ${request.url}`);
  };
  
  export const authenticationMiddleware = async (request, reply) => {
    const token = request.headers['authorization'];
    if (!token) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
    try {
      const decoded = await request.jwtVerify(token); // Verify JWT token
      request.user = decoded; // Attach user data to the request object
    } catch (err) {
      reply.code(401).send({ error: 'Invalid token' });
    }
  };
  
  export const errorHandlingMiddleware = async (request, reply, error) => {
    console.error('Error occurred:', error);
    reply.code(500).send({ error: 'Internal Server Error' });
  };