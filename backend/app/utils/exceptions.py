from typing import Optional, Dict, Any
from fastapi import HTTPException

class APIException(HTTPException):
    def __init__(
        self,
        status_code: int = 400,
        code: str = "BAD_REQUEST",
        message: str = "An error occurred",
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(status_code=status_code, detail=message)
        self.code = code
        self.message = message
        self.details = details or {}

class ResourceNotFoundException(APIException):
    def __init__(self, message: str = "Resource not found", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            status_code=404,
            code="RESOURCE_NOT_FOUND",
            message=message,
            details=details
        )

class ValidationException(APIException):
    def __init__(self, message: str = "Invalid input data", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            status_code=422,
            code="VALIDATION_ERROR",
            message=message,
            details=details
        )

class PythonSyntaxException(APIException):
    def __init__(self, message: str = "Syntax error in submitted code", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            status_code=400,
            code="PYTHON_SYNTAX_ERROR",
            message=message,
            details=details
        )
