import {z} from 'zod';


const handleZodError = ( res, error) => {
const errorsMap = new Map();

error.issues.forEach((err) => {
  const field = err.path.join(".");
  if (!errorsMap.has(field)) {
    errorsMap.set(field, {
      message: err.message,
      path: err.path,
    });
  }
});

// Convert the Map back to an array of errors
const errors = Array.from(errorsMap.values());
        
 res.status(400).json({ 
     message: "Validation Error",
     errors,
  });
}


const errorHandler = (error,req,res,next) => {
    console.log(`Path ${req.path}`,error);

    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    console.error('Bad JSON:', error.message);
    return res.status(400).json({
      status: 'error',
      message: 'Invalid JSON payload received. Please check your request body format.',
    });
  }
    if (error instanceof z.ZodError) {
      return handleZodError(res,error);
    } else return res.status(500).send("Internal Server Error");


}
export default errorHandler;