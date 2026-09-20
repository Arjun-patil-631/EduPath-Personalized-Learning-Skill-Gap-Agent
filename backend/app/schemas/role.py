from typing import List, Dict
from pydantic import BaseModel

class TargetRoleSchema(BaseModel):
    id: str
    title: str
    level: str
    demandIndex: str
    averageSalary: str
    description: str
    requiredSkills: Dict[str, int]
    keyCompetencies: List[str]

class SetTargetRoleRequest(BaseModel):
    roleId: str
