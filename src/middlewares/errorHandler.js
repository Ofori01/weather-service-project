

export async function errorHandler(err,req,res,next) {

    const error = {...err}
    error.message = err.message

    //Other error types


    //response

    res.status(error.statusCode || 500).send({
        success: false,
        message : error.message || "Server error"
    })
    
}