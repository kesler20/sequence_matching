import os
from dotenv import load_dotenv

load_dotenv()

END_POINT = os.getenv("REACT_APP_AWS_IOT_ENDPOINT")
PATH_TO_ROOT_CA = os.path.join(os.path.dirname(os.path.abspath(__file__)), "AmazonRootCA1.pem")
PATH_TO_PRIVATE_KEY = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "9343eecbd39fc8666c2dceff21b308511388e4812042b6a58374f20885f45b57-private.pem.key",
)
PATH_TO_CERTIFICATE = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "9343eecbd39fc8666c2dceff21b308511388e4812042b6a58374f20885f45b57-certificate.pem.crt",
)
