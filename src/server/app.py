import os
import asyncio
import json
from server.websocket_adapter import WebSocketAdapter
import server.sequencematching as sequencematching_use_case
from fastapi import UploadFile, File, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse, HTMLResponse
import uvicorn
from starlette.middleware.cors import CORSMiddleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
import os
from dotenv import load_dotenv

load_dotenv()

__version__ = "0.3.1"
FRONT_END_URL = os.getenv("FRONT_END_URL", "https://wiz-app.up.railway.app")
PUBLIC_FRONTEND_URL = os.getenv(
    "PUBLIC_FRONTEND_URL", "https://kesler20.github.io/sequence_matching"
)


# ============ INSTANTIATE APP OBJECT ===============
app = FastAPI(
    title="Sequence Matching API",
    description="The service for managing sequence matching tasks",
    version=__version__,
)

# =========== ADD MIDDLEWARE FOR CORS ====
origins = [
    "http://localhost:3000",
    "https://localhost:3000",
    "http://0.0.0.0:3000",
    "http://localhost:3001",
    FRONT_END_URL,
    PUBLIC_FRONTEND_URL,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def startup_event():
    # Your function code here
    print("Server has starting")

    print("CHECK THIS PATH-------")
    print(os.listdir(os.path.dirname(sequencematching_use_case.SCANS_FOLDER)))
    print(os.listdir(os.path.dirname(sequencematching_use_case.OUTPUT_FOLDER)))

    print("CLEAN UP THE PATH")
    sequencematching_use_case.reset_input_and_output_folders()

    print("CLEAN UP DONE")
    print(os.listdir(os.path.dirname(sequencematching_use_case.SCANS_FOLDER)))
    print(os.listdir(os.path.dirname(sequencematching_use_case.OUTPUT_FOLDER)))


app.add_event_handler("startup", startup_event)


@app.post(
    "/sequencematching/1",
)
def create_spiral_plot_1(sequence_length: int, uploaded_file1: UploadFile = File(...)):
    from server.legacy_adapter import LegacyAdapter

    sequencematching_use_case.reset_input_and_output_folders()

    number_of_scans = 1
    with open(
        os.path.join(
            sequencematching_use_case.SCANS_FOLDER, uploaded_file1.filename or ""
        ),
        "wb",
    ) as f1:
        f1.write(uploaded_file1.file.read())

    sequencematching_use_case.main(sequence_length, number_of_scans, LegacyAdapter())

    return dict(job_id=1)


@app.post(
    "/sequencematching/2",
)
def create_spiral_plot_2(
    sequence_length: int,
    uploaded_file1: UploadFile = File(...),
    uploaded_file2: UploadFile = File(...),
):
    from server.legacy_adapter import LegacyAdapter

    sequencematching_use_case.reset_input_and_output_folders()

    number_of_scans = 2
    with open(
        os.path.join(
            sequencematching_use_case.SCANS_FOLDER, uploaded_file1.filename or ""
        ),
        "wb",
    ) as f1, open(
        os.path.join(
            sequencematching_use_case.SCANS_FOLDER, uploaded_file2.filename or ""
        ),
        "wb",
    ) as f2:
        f1.write(uploaded_file1.file.read())
        f2.write(uploaded_file2.file.read())

    sequencematching_use_case.main(sequence_length, number_of_scans, LegacyAdapter())

    return dict(job_id=1)


@app.post(
    "/sequencematching/3",
)
def create_spiral_plot_3(
    sequence_length: int,
    uploaded_file1: UploadFile = File(...),
    uploaded_file2: UploadFile = File(...),
    uploaded_file3: UploadFile = File(...),
):
    from server.legacy_adapter import LegacyAdapter

    sequencematching_use_case.reset_input_and_output_folders()

    number_of_scans = 3
    with open(
        os.path.join(
            sequencematching_use_case.SCANS_FOLDER, uploaded_file1.filename or ""
        ),
        "wb",
    ) as f1, open(
        os.path.join(
            sequencematching_use_case.SCANS_FOLDER, uploaded_file2.filename or ""
        ),
        "wb",
    ) as f2, open(
        os.path.join(
            sequencematching_use_case.SCANS_FOLDER, uploaded_file3.filename or ""
        ),
        "wb",
    ) as f3:
        f1.write(uploaded_file1.file.read())
        f2.write(uploaded_file2.file.read())
        f3.write(uploaded_file3.file.read())

    sequencematching_use_case.main(sequence_length, number_of_scans, LegacyAdapter())

    return dict(job_id=1)


@app.websocket("/ws/sequence-matching")
async def websocket_sequence_matching(websocket: WebSocket):
    """WebSocket endpoint that accepts scan files, runs the sequence matching
    algorithm, and streams progress updates back to the client in real time.

    Protocol:
    1. Client connects to ws://<host>/ws/sequence-matching
    2. Client sends a JSON message: {"sequence_length": int, "number_of_scans": int}
    3. Client sends binary file messages, one per scan: {"filename": str, "data": base64}
    4. Server runs the algorithm and streams progress as JSON messages with "topic" and "data" fields
    5. Server sends {"topic": "completed", "data": {}} when done, then closes.
    """
    await websocket.accept()
    try:
        # Step 1: Receive configuration
        config_raw = await websocket.receive_text()
        config = json.loads(config_raw)
        sequence_length = int(config["sequence_length"])
        number_of_scans = int(config["number_of_scans"])

        # Step 2: Reset folders and receive scan files
        sequencematching_use_case.reset_input_and_output_folders()

        for _ in range(number_of_scans):
            file_msg_raw = await websocket.receive_text()
            file_msg = json.loads(file_msg_raw)
            filename = file_msg["filename"]
            import base64

            file_data = base64.b64decode(file_msg["data"])

            file_path = os.path.join(sequencematching_use_case.SCANS_FOLDER, filename)
            with open(file_path, "wb") as f:
                f.write(file_data)

        # Step 3: Create the WebSocket adapter and run the algorithm in a thread
        loop = asyncio.get_event_loop()
        adapter = WebSocketAdapter(websocket, loop)

        await loop.run_in_executor(
            None,
            sequencematching_use_case.main,
            sequence_length,
            number_of_scans,
            adapter,
        )

        # Step 4: Signal completion
        await websocket.send_text(json.dumps({"topic": "completed", "data": {}}))

    except WebSocketDisconnect:
        print("WebSocket client disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")
        try:
            await websocket.send_text(
                json.dumps({"topic": "error", "data": {"message": str(e)}})
            )
        except Exception:
            pass
    finally:
        try:
            await websocket.close()
        except Exception:
            pass


@app.get("/sequencematching/{plot_number}")
def get_spiral_plot(plot_number: int):
    print("Get plot number", plot_number)
    print("Files in the folder", os.listdir(sequencematching_use_case.OUTPUT_FOLDER))
    if plot_number == -1:
        return FileResponse(
            os.path.join(sequencematching_use_case.OUTPUT_FOLDER, "linear_plot.png"),
            media_type="image/png",
            filename=os.path.join(f"linear_plot.png"),
        )

    return FileResponse(
        os.path.join(sequencematching_use_case.OUTPUT_FOLDER, f"plot{plot_number}.png"),
        media_type="image/png",
        filename=os.path.join(f"plot{plot_number}.png"),
    )


@app.get("/", tags=["root"])
async def read_root():
    return HTMLResponse(
        content=f"""
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sequence Matching</title>
        <style>
            body {{
                margin: 0;
                min-height: 100vh;
                display: grid;
                place-items: center;
                font-family: Arial, sans-serif;
                background: #0f172a;
                color: #e2e8f0;
            }}
            .banner {{
                max-width: 720px;
                margin: 24px;
                padding: 24px;
                border-radius: 12px;
                background: #1e293b;
                border: 1px solid #334155;
                text-align: center;
            }}
            .link {{
                display: inline-block;
                margin-top: 16px;
                padding: 10px 16px;
                border-radius: 8px;
                text-decoration: none;
                background: #38bdf8;
                color: #0f172a;
                font-weight: 700;
            }}
        </style>
    </head>
    <body>
        <main class="banner">
            <h1>Sequence Matching has moved</h1>
            <p>
                This Railway app will be retired soon. Please use the official frontend at:
            </p>
            <a class="link" href="{PUBLIC_FRONTEND_URL}">{PUBLIC_FRONTEND_URL}</a>
        </main>
    </body>
</html>
"""
    )


@app.get("/api/version")
async def get_version():
    return {"version": __version__}


if __name__ == "__main__":
    # uvicorn server.app:app --reload
    uvicorn.run(app, port=8000)  # type: ignore
