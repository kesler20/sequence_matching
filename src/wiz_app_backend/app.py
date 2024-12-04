import os
from wiz_app_backend.mqtt_adapter import MQTTAdapter
import wiz_app_backend.sequencematching as sequencematching_use_case
from fastapi import UploadFile, File
from fastapi.responses import FileResponse, RedirectResponse
import uvicorn
from starlette.middleware.cors import CORSMiddleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
import os
from dotenv import load_dotenv

load_dotenv()

__version__ = "0.3.1"
FRONT_END_URL = os.getenv("REACT_APP_FRONT_END_URL")


# ============ INSTANTIATE APP OBJECT ===============
app = FastAPI(
    title="wiz_app_resource_manager",
    description="The service for managing resource for Wiz App",
    version=__version__,
)

# =========== ADD MIDDLEWARE FOR CORS ====
origins = [
    "http://localhost:3000",
    "https://localhost:3000",
    "http://0.0.0.0:3000",
    "http://localhost:3001",
    FRONT_END_URL,
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
    "/v1/sequencematching/1",
)
def create_spiral_plot_1(sequence_length: int, uploaded_file1: UploadFile = File(...)):
    sequencematching_use_case.reset_input_and_output_folders()

    number_of_scans = 1
    with open(
        os.path.join(
            sequencematching_use_case.SCANS_FOLDER, uploaded_file1.filename or ""
        ),
        "wb",
    ) as f1:
        f1.write(uploaded_file1.file.read())

    sequencematching_use_case.main(sequence_length, number_of_scans, MQTTAdapter())

    return dict(job_id=1)


@app.post(
    "/v1/sequencematching/2",
)
def create_spiral_plot_2(
    sequence_length: int,
    uploaded_file1: UploadFile = File(...),
    uploaded_file2: UploadFile = File(...),
):
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

    sequencematching_use_case.main(sequence_length, number_of_scans, MQTTAdapter())

    return dict(job_id=1)


@app.post(
    "/v1/sequencematching/3",
)
def create_spiral_plot_3(
    sequence_length: int,
    uploaded_file1: UploadFile = File(...),
    uploaded_file2: UploadFile = File(...),
    uploaded_file3: UploadFile = File(...),
):
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

    sequencematching_use_case.main(sequence_length, number_of_scans, MQTTAdapter())

    return dict(job_id=1)


@app.get("/v1/sequencematching/{plot_number}")
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
    response = RedirectResponse(url="/docs")
    return response


@app.get("/api/version")
async def get_version():
    return {"version": __version__}


if __name__ == "__main__":
    # uvicorn wiz_app_backend.app:app --reload
    uvicorn.run(app, port=8000)  # type: ignore
