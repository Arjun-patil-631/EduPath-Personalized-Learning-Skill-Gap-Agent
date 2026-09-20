import datetime
from sqlalchemy import Column, String, Integer, Text, Boolean, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class AssessmentQuestion(Base):
    __tablename__ = "assessment_questions"

    id = Column(String, primary_key=True, index=True)  # e.g., "q1", "q2"
    skill = Column(String, nullable=False)
    title = Column(String, nullable=False)
    question = Column(Text, nullable=False)
    code_snippet = Column(Text, nullable=True)
    explanation = Column(Text, nullable=False)

    options = relationship("AssessmentOption", back_populates="question", cascade="all, delete-orphan")


class AssessmentOption(Base):
    __tablename__ = "assessment_options"

    id = Column(Integer, primary_key=True, autoincrement=True)
    question_id = Column(String, ForeignKey("assessment_questions.id"), nullable=False)
    option_key = Column(String, nullable=False)  # "a", "b", "c", "d"
    text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)

    question = relationship("AssessmentQuestion", back_populates="options")


class AssessmentSubmission(Base):
    __tablename__ = "assessment_submissions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    answers = Column(JSON, nullable=False)
    evaluated_scores = Column(JSON, nullable=False)
    summary = Column(Text, nullable=True)
    submitted_at = Column(DateTime, default=datetime.datetime.utcnow)
