import { Request } from "express";
import validate from "validate.js";

var constraints = {
    username: {
      presence: true,
      length: {
        minimum: 3,
        maximum: 10,
        message: "must be between 3 and 10 characters"
      },
      exclusion: {
        within: ["nicklas"],
        message: "'%{value}' is not allowed"
      }
    },
    password: {
      presence: true,
      length: {
        minimum: 6,
        message: "must be at least 6 characters"
      }
    },
    email: {
        presence: true,
        email: true
    }
  };

function userRegisterLocalValidator(req: Request){
    const errors = validate(req.body, constraints);
    if (errors) {
        const errorMessages = Object.values(errors).map((value: any) => value[0]);
        throw new Error(errorMessages.join(", "));
    }
}

export { userRegisterLocalValidator };