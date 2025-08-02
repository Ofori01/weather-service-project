import { validationResult } from "express-validator"


//validation middleware
export const validate=(req,res,next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).send({
            success: false,
            message: "Validation failed",
            errors: errors.array()
        })
    }
}


