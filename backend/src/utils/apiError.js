class apiError extends Error{
    constructor(
        statusCode,
        message = "Something Went Wrong",
        errors = [],
        stack = ""
    ){
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.data = null;
        this.message = message;
        this.success = false;

        if (stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor);
        }

    }
    
};

export { apiError };