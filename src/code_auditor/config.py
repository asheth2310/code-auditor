import os
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""
    github_token: str = Field(..., description="GitHub Personal Access Token with repo scope")
    openai_api_key: str = Field(..., description="OpenAI API key for LLM agents")
    docker_image: str = Field(default="python:3.11-slim", description="Docker image for sandbox")
    sandbox_timeout: int = Field(default=30, description="Max seconds for sandbox execution")
    max_patch_retries: int = Field(default=3, description="Max retry attempts for patch agent")
    
    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}

def get_settings() -> Settings:
    return Settings()
