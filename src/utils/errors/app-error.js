class AppError extends Error{
    constructor(
        name,
        message,
        explanation,
        statusCode
    ){
        super();
        this.name=name;
        this.explanation=explanation;
        this.message=message;
        this.statusCode=statusCode
    }
}

module.exports=AppError;