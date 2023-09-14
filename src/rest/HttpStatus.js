const HttpStatus = {
    OK: {
        code: 200,
        status: "Ok",
    },
    CREATED: {
        code: 201,
        status: "Created",
    },
    NO_CONTENT: {
        code: 204,
        status: "No Content",
    },
    BAD_REQUEST: {
        code: 400,
        status: "Bad Request",
    },
    NOT_FOUND: {
        code: 404,
        status: "Not found",
    },
    INTERNAL_SERVER_ERROR: {
        code: 500,
        status: "Internal Server Error",
    },
};

export default HttpStatus;