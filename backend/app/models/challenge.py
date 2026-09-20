from sqlalchemy import Column, String, Integer, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class Challenge(Base):
    __tablename__ = "challenges"

    id = Column(String, primary_key=True, index=True)  # e.g., "act_prob_771"
    title = Column(String, nullable=False)
    duration_minutes = Column(Integer, default=25)
    difficulty = Column(String, default="Intermediate")
    estimated_time = Column(String, default="25 min")
    category = Column(String, nullable=False)
    scenario = Column(Text, nullable=False)
    starter_code = Column(Text, nullable=False)
    instructions = Column(JSON, default=list)
    
    # Target skill impacted by this challenge
    target_skill = Column(String, nullable=False)  # "Statistics" or "Machine Learning"
    max_gain = Column(Integer, default=25)          # maximum potential skill points on 100% test pass
    xp_award = Column(Integer, default=350)

    test_cases = relationship("TestCase", back_populates="challenge", cascade="all, delete-orphan")


class TestCase(Base):
    __tablename__ = "test_cases"

    id = Column(String, primary_key=True, index=True)  # e.g., "tc_1"
    challenge_id = Column(String, ForeignKey("challenges.id"), nullable=False)
    case_key = Column(String, nullable=False)          # "tc_1", "tc_2"
    name = Column(String, nullable=False)
    input_repr = Column(String, nullable=False)
    expected_output = Column(String, nullable=False)
    assertion_code = Column(Text, nullable=False)      # Python test snippet executed in sandbox
    latency = Column(String, default="1.0ms")

    challenge = relationship("Challenge", back_populates="test_cases")
