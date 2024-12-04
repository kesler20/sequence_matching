import CryptoJS from "crypto-js";
import mqtt from "mqtt";

export default class MQTTApi {
  clientId: string;
  client: any;

  constructor() {
    this.clientId = this.generateRandomString(20);
    this.client = this.connectClient();
    this.client.on("error", (e: any) => {
      console.log("Connection error: ", e);
    });
  }
  /**
   * This function will run when the client is initially instantiated and will connect the client to the
   * broker via a secure connection
   *
   * @returns {*} returns an instance of an MQTT object
   */
  private connectClient() {
    return mqtt.connect(this.getEndpoint());
  }

  /**
   * generates a random string of letters the given length
   * @param length {number} the length of the random string to generate
   * @returns {string} a random string of the given length
   */
  private generateRandomString(length: number) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
  }

  /**
   * This function generates the endpoint to connection to AWS from the credentials provided
   *
   * @returns {*} the mqtt web socket endpoint used for streaming connection
   */
  private getEndpoint() {
    const REGION = "eu-west-2";

    // your AWS access key ID
    const AWS_ACCESS_KEY_ID = process.env.REACT_APP_AWS_ACCESS_KEY_ID;

    // your AWS secret access key
    const AWS_SECRET_ACCESS_KEY = process.env.REACT_APP_AWS_SECRET_KEY;
    const ENDPOINT = process.env.REACT_APP_AWS_IOT_ENDPOINT;

    const now = new Date();
    const amzdate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
    const datestamp = now.toISOString().slice(0, 10).replace(/-/g, "");
    const service = "iotdevicegateway";

    const canonicalQuerystring = `X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=${encodeURIComponent(
      AWS_ACCESS_KEY_ID +
        "/" +
        datestamp +
        "/" +
        REGION +
        "/" +
        service +
        "/aws4_request"
    )}&X-Amz-Date=${amzdate}&X-Amz-SignedHeaders=host`;
    const canonicalHeaders = `host:${ENDPOINT}\n`;
    const signedHeaders = "host";
    const payloadHash = CryptoJS.SHA256("").toString(CryptoJS.enc.Hex);
    const canonicalRequest = `GET\n/mqtt\n${canonicalQuerystring}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

    const algorithm = "AWS4-HMAC-SHA256";
    const credentialScope = `${datestamp}/${REGION}/${service}/aws4_request`;
    const stringToSign = `${algorithm}\n${amzdate}\n${credentialScope}\n${CryptoJS.SHA256(
      canonicalRequest
    ).toString(CryptoJS.enc.Hex)}`;

    const kDate = CryptoJS.HmacSHA256(datestamp, "AWS4" + AWS_SECRET_ACCESS_KEY);
    const kRegion = CryptoJS.HmacSHA256(REGION, kDate);
    const kService = CryptoJS.HmacSHA256(service, kRegion);
    const kSigning = CryptoJS.HmacSHA256("aws4_request", kService);
    const signature = CryptoJS.HmacSHA256(stringToSign, kSigning).toString(
      CryptoJS.enc.Hex
    );

    return `wss://${ENDPOINT}/mqtt?${canonicalQuerystring}&X-Amz-Signature=${signature}`;
  }

  /**
   * this function subscribe the client to the provided topic,
   * the function should be called within the on connect callback and
   *
   * @param {*} topic - a topic is a channel where data can be streamed too and consumed by various clients
   * @param {*} callBack - a callback is a function which will be executed when the client subscribe
   */
  subscribeClient(topic: string, callBack: CallableFunction) {
    this.client.subscribe(topic, (err: any) => {
      if (!err) {
        console.log("subscribed", topic);
        callBack();
      } else {
        console.log(err);
      }
    });
  }

  /**
   * This function runs when the mqttClient is connected to the web socket which occurs when the class is instantiated
   * @see the connectClient() method
   * keep this function within a ``useEffect`` or a ``componentDidMount()`` to avoid connection timeout errors
   *
   * @param {*} callBack - a callback is a function which will be executed when the client connect
   * specify most of the logic of the client within this block
   */
  onConnect(callBack: CallableFunction) {
    this.client.on("connect", () => {
      callBack();
    });
  }

  /**
   * This function runs the callback when a new message arrives,
   * the message event listener of the MQTT object returns the topic and the message that are received automatically
   * however this is taken care of within the wrapper function therefore the callback should have:
   *
   * ```javascript
   * const onMessageCallBack(message) {
   *   messageProcessingLogic()
   * }
   * ```
   * call this function wihtin the onConnect callback,
   * after the client is subscribed i.e.
   *
   * ```javascript
   * onConnect(() => {
   *   onSubscribe()
   *   onMessage(onMessageCallback)
   *  }
   * )
   * ```
   *
   * @param {*} callBack - this is a function which is called when a new message arrives
   * to a topic which the client is listening too
   */
  onMessage(callbackTopic: string, callBack: CallableFunction) {
    this.client.on("message", (topic: string, message: any) => {
      if (callbackTopic == topic) {
        let decodedMessage = message.toString();
        callBack(decodedMessage);
      }
    });
  }

  /**
   * This function publishes messages to the Broker <AWS>,the quality of service is kept as 0 to avoid timeouts
   *
   * @param {*} topic - the topic which the client will publish the message to
   * @param {*} payload - the payload that the client needs to publish
   */
  publishMessage(topic: string, payload: Object) {
    this.client.publish(topic, JSON.stringify(payload), { qos: 0 }, (error: any) => {
      console.log(topic, payload);
      if (error) {
        console.log(error);
      }
    });
  }

  unsubscribeClient(topic: string) {
    this.client.unsubscribe(topic, () => {
      console.log("unsubscribed", topic);
    });
    return this;
  }

  disconnectClient() {
    this.client.end();
  }
}
