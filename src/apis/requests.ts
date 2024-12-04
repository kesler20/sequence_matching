import axios from "axios";
import {
  CreateFileResponse,
  CreateNotificationRequest,
  CreateNotificationResponse,
  CreateSequenceMatchingResponse,
  CreateUserResponse,
  GetAllLabEquipmentResponse,
  GetAllSensorResponse,
  GetLabEquipmentResponse,
  GetUserResponse,
  UpdateFileResponse,
} from "./schema";
import {
  ProcessDataPoint,
  ResolutionKey,
} from "../pages/monitoring/state_machine/monitoringPageTypes";
import {
  PCAResponse,
  PLSResponse,
} from "../pages/data_analytics/state_machine/types";

export const URL = process.env.REACT_APP_BACKEND_URL_PROD;

export const getUserData = async (username: string) => {
  try {
    const response = await axios.get<GetUserResponse>(`${URL}/user/${username}`);
    return response.data.resource;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export const createUser = async (user: CreateUserResponse) => {
  try {
    const response = await axios.post<CreateUserResponse>(`${URL}/users`, user);
    return response.data.resource;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export const uploadFile = async (formData: FormData, username: string) => {
  try {
    const response = await axios.post<CreateFileResponse>(
      `${URL}/file/${username}`,
      formData
    );
    if (response.status < 400) {
      const { resource, resource_content } = response.data;
      return { resource, resource_content };
    } else {
      return undefined;
    }
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export const updateFile = async (formData: FormData, username: string) => {
  try {
    const response = await axios.put<UpdateFileResponse>(
      `${URL}/file/${username}`,
      formData
    );
    if (response.status < 400) {
      const { resource, resource_content } = response.data;
      return { resource, resource_content };
    } else {
      return undefined;
    }
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export const createNotification = async (
  notification: CreateNotificationRequest
) => {
  try {
    const response = await axios.post<CreateNotificationResponse>(
      `${URL}/notification`,
      notification
    );
    if (response.status < 400) {
      return response.data.resource;
    } else {
      return undefined;
    }
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export const sendScansToSequenceMatchingService = async (
  formData: FormData,
  sequence_length: number,
  numberOfScans: number
) => {
  try {
    const response = await axios.post<CreateSequenceMatchingResponse>(
      `${URL}/sequencematching/${numberOfScans}`,
      formData,
      { params: { sequence_length } }
    );
    if (response.status < 400) {
      return response.data.job_id;
    } else {
      return undefined;
    }
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export const getAllSensors = async () => {
  try {
    const response = await axios.get<GetAllSensorResponse>(`${URL}/sensors`);
    if (response.status < 400) {
      return response.data.items;
    } else {
      return undefined;
    }
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export const getAllLabEquipment = async () => {
  try {
    const response = await axios.get<GetAllLabEquipmentResponse>(
      `${URL}/lab_equipments`
    );
    if (response.status < 400) {
      return response.data.items;
    } else {
      return undefined;
    }
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export const getLabEquipment = async (lab_equipment_id: number) => {
  try {
    const response = await axios.get<GetLabEquipmentResponse>(
      `${URL}/lab_equipments/${lab_equipment_id}`
    );
    if (response.status < 400) {
      return response.data.resource;
    } else {
      return undefined;
    }
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export const getLaboratory = async (laboratory_id: number) => {
  try {
    const response = await axios.get<{
      resource: any;
    }>(`${URL}/laboratory/${laboratory_id}`);
    if (response.status < 400) {
      return response.data.resource;
    } else {
      return undefined;
    }
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export const getNotifications = async () => {
  try {
    const response = await axios.get<{
      items: { event_description: string; timestamp: number }[];
    }>(`${URL}/events`);
    if (response.status < 400) {
      return response.data.items;
    } else {
      return undefined;
    }
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export const getProcessData = async (
  topic: string,
  range_units: ResolutionKey,
  range_value: number,
  resolution: number | null
) => {
  if (resolution === null) {
    resolution = 0;
  }

  try {
    const response = await axios.get<{
      items: ProcessDataPoint[];
    }>(`${URL}/process_data/${topic}/${range_units}/${range_value}/${resolution}`);
    if (response.status < 400) {
      return response.data.items;
    } else {
      return undefined;
    }
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export const getProcessDataSet = async (
  topicsList: string[],
  range_units: ResolutionKey,
  range_value: number,
  resolution: number | null
) => {
  let topics = "";
  for (let topic of topicsList) {
    topics += topic + ",";
  }

  if (resolution === null) {
    resolution = 0;
  }

  try {
    const response = await axios.get<{
      items: ProcessDataPoint[];
    }>(`${URL}/process_data/${topics}/${range_units}/${range_value}/${resolution}`);
    if (response.status < 400) {
      return response.data.items;
    } else {
      return undefined;
    }
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export const createPCAModel = async (modelName: string, sensor_topics: string[]) => {
  try {
    const response = await axios.post<PCAResponse>(
      `${URL}/pca?model_name=${modelName}`,
      sensor_topics
    );
    if (response.status < 400) {
      return response.data;
    } else {
      return undefined;
    }
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export const createPLSModel = async (
  modelName: string,
  sensor_topics: string[],
  chemical_data_columns: string[]
) => {
  try {
    const response = await axios.post<PLSResponse>(
      `${URL}/pls?model_name=${modelName}`,
      { sensor_topics, chemical_data_columns }
    );
    if (response.status < 400) {
      return response.data;
    } else {
      return undefined;
    }
  } catch (e) {
    console.log(e);
    return undefined;
  }
};
