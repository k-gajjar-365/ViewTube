const errorHandler = (err, _ , res, next) => {
   const status = err.statusCode || 500;
   const message = err.message || "Internal server error";

   res.status(status).json({
      success: false,
      message,
   });

   next();
};

export default errorHandler;
