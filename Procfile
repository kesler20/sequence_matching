web: pip install -e . && gunicorn wiz_app_backend.app:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:$PORT