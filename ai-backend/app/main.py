from __future__ import annotations

import uvicorn
from fastapi import FastAPI

from app.api.api_v1.router import router as api_router


def create_app() -> FastAPI:
    app = FastAPI(title="AI Backend", version="0.1.0")
    app.include_router(api_router, prefix="/api")
    return app


app = create_app()


def main() -> None:
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)


if __name__ == "__main__":
    main()
