import json
import string
import typing
import random
from typing import Callable, Optional, Any, Dict, Union
import AWSIoTPythonSDK.MQTTLib as AWSIoTPyMQTT
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
from wiz_app_backend.credentials.config import (
    END_POINT,
    PATH_TO_ROOT_CA,
    PATH_TO_PRIVATE_KEY,
    PATH_TO_CERTIFICATE,
)
from enum import Enum
from dataclasses import dataclass
from pydantic import BaseModel

# MQTT Message
class QualityofService(Enum):
    AT_MOST_ONCE = 0
    AT_LEAST_ONCE = 1
    EXACTLY_ONCE = 2


@dataclass
class MQTTMessage(BaseModel):
    timestamp: int
    state: bool
    dup: bool
    mid: bool
    topic: str
    payload: bytes
    qos: QualityofService
    retain: bool


class MQTTAdapter:
    """AWS IoT MQTT Clients using TLSv1.2 Mutual Authentication
    for more information on AWS documentation see
    https://s3.amazonaws.com/aws-iot-device-sdk-python-docs/html/index.html#module-AWSIoTPythonSDK.MQTTLib
    The class i a singleton which means that there can only be one instance of this class in the code
    this is to keep one connection of the MQTT client to the broker

    to implement the client you can subscribe to a channel and
    implement some logic within a loop i.e.:

    ```python
    def cb(client: None,user_data: None,message: MQTTMessage) -> None:
        data = message.payload.decode()
        print(data)

    client = MQTTClient()
    client.connect()
    client.subscribe_to_topic("device/control",cb)
    flag = 0
    while True:
        try:
            # application running in the loop
            if flag:
                client.publish_data("device/data","hello world")
            ...
        except AWSIoTPythonSDK.exception.AWSIoTExceptions.subscribeTimeoutException:
            pass
    ```

    The client is connected when the constructor is called, and can be disconnected using the tear_down method
    """

    _instance = None

    def __init__(self) -> None:
        self.__clientID = self.__generate_clientID()
        self.__client: AWSIoTMQTTClient = AWSIoTPyMQTT.AWSIoTMQTTClient(self.__clientID)
        self.__topics_subscribed_to: typing.List[str] = []

    @property
    def topics_subscribed_to(self) -> typing.List[str]:
        """The list of topics that the client is subscribed to."""
        return self.__topics_subscribed_to

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super().__new__(cls, *args, **kwargs)
        return cls._instance

    def __enter__(self):
        self.__connect_client()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.__disconnect()

    def connect(self):
        self.__connect_client()
        return self

    @property
    def clientID(self) -> str:
        """returns a random string of 8 digits"""
        return self.__clientID

    @property
    def client(self) -> AWSIoTMQTTClient:
        return self.__client

    def __generate_clientID(self, length: int = 8) -> str:
        return "".join(random.choices(string.ascii_uppercase, k=length))

    def __connect_client(self) -> None:
        self.client.configureEndpoint(END_POINT, 8883)
        self.client.configureCredentials(PATH_TO_ROOT_CA, PATH_TO_PRIVATE_KEY, PATH_TO_CERTIFICATE)
        self.client.connect(keepAliveIntervalSecond=10)

    def __disconnect(self) -> None:
        for topic in self.topics_subscribed_to:
            self.client.unsubscribe(topic)
        self.client.disconnect()

    def unsubscribe_from_topic(self, topic: str) -> typing.List[str]:
        """Unsubscribe from the topic passed

        Parameters
        ----------
        topic : str
            Topic to unsubscribe from.

        Side Effects
        ------------
        This will also remove the first occurence of the topic passed
        from the list of `topics_subscribed_to`.

        Returns
        -------
            List[str] :
            The list of topics that the client is still subscribed to.
        """
        self.__topics_subscribed_to.remove(topic)
        self.client.unsubscribe(topic)
        return self.__topics_subscribed_to

    def unsubscribe_and_disconnect(self) -> None:
        """Unsubscribes from all the topic which this class was subscribed to using
        `subscribe_to_topic` and disconnects the client from the session.
        ```markdown
        >NOTE: This function cannot be run asynchronously as this will throw an error
        ```
        """
        self.__disconnect()

    def publish_data(
        self,
        topic: str,
        payload: Union[Dict[str, Any], str],
        quos: Optional[int] = QualityofService.AT_MOST_ONCE.value,
    ) -> bool:
        """publish to the given topic

        Params
        ---
        topic: str
            the topic which the client listens too
        payload: str | dict
            the payload which will be sent
        quos: int
            Quality of Service set to 0 (at most once) as default

        Returns
        ---
        None

        Note
        ---
        if you want to pass a dictionary as payload

        ```python
        import json

        json.dumps(my_dict)
        ```
        if you want to pass a pandas data frame

        ```python
        import pandas as pd
        df = pd.DataFrame([1,2])
        df.to_json()
        ```
        """

        if type(payload) is dict:
            payload = json.dumps(payload)
        self.client.publish(topic, payload, quos)
        payload_summary = ""
        for index, char in enumerate(payload):
            if index < 200:
                payload_summary += char
        print("publish", topic, payload_summary)
        return True

    def subscribe_to_topic(
        self,
        topic: str,
        custom_callback: Callable[[None, None, MQTTMessage], None],
        quos: Optional[int] = QualityofService.AT_LEAST_ONCE.value,
    ) -> bool:
        """subscribe to the given topic

        Params
        ---
        topic: str
            the topic which the client listens too
        custom_callback: func
            the function which will be called anytime a new message arrives
        quos: int
            Quality of Service set to 1 (At least once) as default

        Returns
        ---
        None

        Note
        ---
        Callback functions should be of the following form:
        ```python
        def callback(client: None,used_data: None ,message: MQTTMessage) -> None:
            function(message)
        ```
        where message has properties message.payload and message.topic"""
        print("subscribe", topic)
        self.__topics_subscribed_to.append(topic)
        return True if self.client.subscribe(topic, quos, custom_callback) else False
