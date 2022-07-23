import { Request } from "express";
import validate from "validate.js";

var constraints = {
    title: {
        presence: true,
        length: {
            minimum: 3,
        }
    },
    free:{
        presence: true,
    },
    price:{
        presence: true,
    }
  };

function postCreateValidator(req: Request){
    const errors = validate(req.body, constraints);
    if (errors) {
        const errorMessages = Object.values(errors).map((value: any) => value[0]);
        throw new Error(errorMessages.join(", "));
    }
}

export { postCreateValidator };