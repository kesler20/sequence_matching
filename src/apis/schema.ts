import { z } from "zod";

// =============
//   BaseModel
// =============

// Requests

const CreateContentfulEntityRequestSchema = z.object({
  username: z.string(),
  resource_content: z.string(),
});

export type CreateContentfulEntityRequest = z.infer<typeof CreateContentfulEntityRequestSchema>;

const CreateEntityRequestSchema = z.object({});

export type CreateEntityRequest = z.infer<typeof CreateEntityRequestSchema>;

const GetAllContentfulEntityRequestSchema = z.object({
  username: z.string(),
});

export type GetAllContentfulEntityRequest = z.infer<typeof GetAllContentfulEntityRequestSchema>;

const GetEntityRequestSchema = z.object({
  id: z.number(),
});

export type GetEntityRequest = z.infer<typeof GetEntityRequestSchema>;

const GetContentfulEntityRequestSchema = z.object({
  username: z.string(),
  id: z.number(),
});

export type GetContentfulEntityRequest = z.infer<typeof GetContentfulEntityRequestSchema>;

const UpdateEntityRequestSchema = z.object({
  id: z.number(),
});

export type UpdateEntityRequest = z.infer<typeof UpdateEntityRequestSchema>;

const UpdateContentfulEntityRequestSchema = z.object({
  id: z.number(),
  username: z.string(),
  resource_content: z.string(),
});

export type UpdateContentfulEntityRequest = z.infer<typeof UpdateContentfulEntityRequestSchema>;

const DeleteEntityRequestSchema = z.object({
  id: z.number(),
});

export type DeleteEntityRequest = z.infer<typeof DeleteEntityRequestSchema>;

const DeleteContentfulEntityRequestSchema = z.object({
  id: z.number(),
  username: z.string(),
});

export type DeleteContentfulEntityRequest = z.infer<typeof DeleteContentfulEntityRequestSchema>;

// Response

const CreateContentfulEntityResponseSchema = z.object({
  resource_content: z.string(),
  resource: z.any(),
});

export type CreateContentfulEntityResponse = z.infer<typeof CreateContentfulEntityResponseSchema>;

const CreateEntityResponseSchema = z.object({
  resource: z.any(),
});

export type CreateEntityResponse = z.infer<typeof CreateEntityResponseSchema>;

const GetAllContentfulEntityResponseSchema = z.object({
  items: z.array(z.any()),
});

export type GetAllContentfulEntityResponse = z.infer<typeof GetAllContentfulEntityResponseSchema>;

const GetAllEntityResponseSchema = z.object({
  items: z.array(z.any()),
});

export type GetAllEntityResponse = z.infer<typeof GetAllEntityResponseSchema>;

const GetContentfulEntityResponseSchema = z.object({
  resource_content: z.string(),
  resource: z.any(),
});

export type GetContentfulEntityResponse = z.infer<typeof GetContentfulEntityResponseSchema>;

const GetEntityResponseSchema = z.object({
  resource: z.any(),
});

export type GetEntityResponse = z.infer<typeof GetEntityResponseSchema>;

const UpdateEntityResponseSchema = z.object({
  resource: z.any(),
});

export type UpdateEntityResponse = z.infer<typeof UpdateEntityResponseSchema>;

const UpdateContentfulEntityResponseSchema = z.object({
  resource_content: z.string(),
  resource: z.any(),
});

export type UpdateContentfulEntityResponse = z.infer<typeof UpdateContentfulEntityResponseSchema>;

const DeleteEntityResponseSchema = z.object({
  remaining_items: z.array(z.any()),
});

export type DeleteEntityResponse = z.infer<typeof DeleteEntityResponseSchema>;

const DeleteContentfulEntityResponseSchema = z.object({
  remaining_items: z.array(z.any()),
});

export type DeleteContentfulEntityResponse = z.infer<typeof DeleteContentfulEntityResponseSchema>;

// ====================
//   Sequence Matching
// =====================

const CreateSequenceMatchingRequestSchema = z.object({
  uploaded_file: z.any(),
});

export type CreateSequenceMatchingRequest = z.infer<typeof CreateSequenceMatchingRequestSchema>;

const CreateSequenceMatchingResponseSchema = z.object({
  job_id: z.number(),
});

export type CreateSequenceMatchingResponse = z.infer<typeof CreateSequenceMatchingResponseSchema>;

// ===============
//  Process Data
// ===============

const NewSensorReadingSchema = z.object({
  Value: z.number(),
  Quality: z.number(),
  Timestamp: z.number(),
  SenderId: z.string(),
  OPC_Point: z.string(),
});

export type NewSensorReading = z.infer<typeof NewSensorReadingSchema>;

// ===============
//  File
// ===============

const CreateFileRequestSchema = z.object({
  upload_file_object: z.any(),
  username: z.string(),
});

export type CreateFileRequest = z.infer<typeof CreateFileRequestSchema>;

const CreateFileResponseSchema = CreateContentfulEntityResponseSchema;

export type CreateFileResponse = z.infer<typeof CreateFileResponseSchema>;

const GetAllFileRequestSchema = GetAllContentfulEntityRequestSchema;

export type GetAllFileRequest = z.infer<typeof GetAllFileRequestSchema>;

const GetAllFileResponseSchema = GetAllContentfulEntityResponseSchema;

export type GetAllFileResponse = z.infer<typeof GetAllFileResponseSchema>;

const GetFileRequestSchema = GetContentfulEntityRequestSchema;

export type GetFileRequest = z.infer<typeof GetFileRequestSchema>;

const GetFileResponseSchema = GetContentfulEntityResponseSchema;

export type GetFileResponse = z.infer<typeof GetFileResponseSchema>;

const UpdateFileRequestSchema = z.object({
  id: z.number(),
  username: z.string(),
  upload_file_object: z.any(),
});

export type UpdateFileRequest = z.infer<typeof UpdateFileRequestSchema>;

const UpdateFileResponseSchema = UpdateContentfulEntityResponseSchema;

export type UpdateFileResponse = z.infer<typeof UpdateFileResponseSchema>;

const DeleteFileRequestSchema = z.object({
  id: z.number(),
  username: z.string(),
});

export type DeleteFileRequest = z.infer<typeof DeleteFileRequestSchema>;

const DeleteFileResponseSchema = DeleteContentfulEntityResponseSchema;

export type DeleteFileResponse = z.infer<typeof DeleteFileResponseSchema>;

// ===============
//  Notification
// ===============

const CreateNotificationRequestSchema = z.object({
  description: z.string(),
  title: z.string(),
});

export type CreateNotificationRequest = z.infer<typeof CreateNotificationRequestSchema>;

const CreateNotificationResponseSchema = CreateEntityResponseSchema;

export type CreateNotificationResponse = z.infer<typeof CreateNotificationResponseSchema>;

const GetAllNotificationResponseSchema = GetAllEntityResponseSchema;

export type GetAllNotificationResponse = z.infer<typeof GetAllNotificationResponseSchema>;

const GetNotificationRequestSchema = GetEntityRequestSchema;

export type GetNotificationRequest = z.infer<typeof GetNotificationRequestSchema>;

const GetNotificationResponseSchema = GetEntityResponseSchema;

export type GetNotificationResponse = z.infer<typeof GetNotificationResponseSchema>;

const UpdateNotificationRequestSchema = z.object({
  id: z.number(),
  description: z.string(),
  title: z.string(),
});

export type UpdateNotificationRequest = z.infer<typeof UpdateNotificationRequestSchema>;

const UpdateNotificationResponseSchema = UpdateEntityResponseSchema;

export type UpdateNotificationResponse = z.infer<typeof UpdateNotificationResponseSchema>;

const DeleteNotificationRequestSchema = DeleteEntityRequestSchema;

export type DeleteNotificationRequest = z.infer<typeof DeleteNotificationRequestSchema>;

const DeleteNotificationResponseSchema = DeleteEntityResponseSchema;

export type DeleteNotificationResponse = z.infer<typeof DeleteNotificationResponseSchema>;

// ===============
//  Role
// ===============

const CreateRoleRequestSchema = z.object({
  name: z.string(),
});

export type CreateRoleRequest = z.infer<typeof CreateRoleRequestSchema>;

const CreateRoleResponseSchema = CreateEntityResponseSchema;

export type CreateRoleResponse = z.infer<typeof CreateRoleResponseSchema>;

const GetAllRoleResponseSchema = GetAllEntityResponseSchema;

export type GetAllRoleResponse = z.infer<typeof GetAllRoleResponseSchema>;

const GetRoleRequestSchema = GetEntityRequestSchema;

export type GetRoleRequest = z.infer<typeof GetRoleRequestSchema>;

const GetRoleResponseSchema = GetEntityResponseSchema;

export type GetRoleResponse = z.infer<typeof GetRoleResponseSchema>;

const UpdateRoleRequestSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type UpdateRoleRequest = z.infer<typeof UpdateRoleRequestSchema>;

const UpdateRoleResponseSchema = UpdateEntityResponseSchema;

export type UpdateRoleResponse = z.infer<typeof UpdateRoleResponseSchema>;

const DeleteRoleRequestSchema = DeleteEntityRequestSchema;

export type DeleteRoleRequest = z.infer<typeof DeleteRoleRequestSchema>;

const DeleteRoleResponseSchema = DeleteEntityResponseSchema;

export type DeleteRoleResponse = z.infer<typeof DeleteRoleResponseSchema>;

// ===============
//  User
// ===============

const CreateUserRequestSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  tutorial_completed: z.boolean(),
  notifications_read: z.boolean(),
});

export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;

const CreateUserResponseSchema = CreateEntityResponseSchema;

export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>;

const GetAllUserResponseSchema = GetAllEntityResponseSchema;

export type GetAllUserResponse = z.infer<typeof GetAllUserResponseSchema>;

const GetUserRequestSchema = z.object({
  username: z.string(),
});

export type GetUserRequest = z.infer<typeof GetUserRequestSchema>;

const GetUserResponseSchema = GetEntityResponseSchema;

export type GetUserResponse = z.infer<typeof GetUserResponseSchema>;

const UpdateUserRequestSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  tutorial_completed: z.boolean(),
  notifications_read: z.boolean(),
});

export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;

const UpdateUserResponseSchema = UpdateEntityResponseSchema;

export type UpdateUserResponse = z.infer<typeof UpdateUserResponseSchema>;

const DeleteUserRequestSchema = DeleteEntityRequestSchema;

export type DeleteUserRequest = z.infer<typeof DeleteUserRequestSchema>;

const DeleteUserResponseSchema = DeleteEntityResponseSchema;

export type DeleteUserResponse = z.infer<typeof DeleteUserResponseSchema>;

// ===============
//  Lab_equipment
// ===============

const CreateLabEquipmentRequestSchema = z.object({
  name: z.string(),
});

export type CreateLabEquipmentRequest = z.infer<typeof CreateLabEquipmentRequestSchema>;

const CreateLabEquipmentResponseSchema = CreateEntityResponseSchema;

export type CreateLabEquipmentResponse = z.infer<typeof CreateLabEquipmentResponseSchema>;

const GetAllLabEquipmentResponseSchema = GetAllEntityResponseSchema;

export type GetAllLabEquipmentResponse = z.infer<typeof GetAllLabEquipmentResponseSchema>;

const GetLabEquipmentRequestSchema = GetEntityRequestSchema;

export type GetLabEquipmentRequest = z.infer<typeof GetLabEquipmentRequestSchema>;

const GetLabEquipmentResponseSchema = GetEntityResponseSchema;

export type GetLabEquipmentResponse = z.infer<typeof GetLabEquipmentResponseSchema>;

const UpdateLabEquipmentRequestSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type UpdateLabEquipmentRequest = z.infer<typeof UpdateLabEquipmentRequestSchema>;

const UpdateLabEquipmentResponseSchema = UpdateEntityResponseSchema;

export type UpdateLabEquipmentResponse = z.infer<typeof UpdateLabEquipmentResponseSchema>;

const DeleteLabEquipmentRequestSchema = DeleteEntityRequestSchema;

export type DeleteLabEquipmentRequest = z.infer<typeof DeleteLabEquipmentRequestSchema>;

const DeleteLabEquipmentResponseSchema = DeleteEntityResponseSchema;

export type DeleteLabEquipmentResponse = z.infer<typeof DeleteLabEquipmentResponseSchema>;

// ===============
//  Sensor
// ===============

const CreateSensorRequestSchema = z.object({
  topic: z.string(),
});

export type CreateSensorRequest = z.infer<typeof CreateSensorRequestSchema>;

const CreateSensorResponseSchema = CreateEntityResponseSchema;

export type CreateSensorResponse = z.infer<typeof CreateSensorResponseSchema>;

const GetAllSensorResponseSchema = GetAllEntityResponseSchema;

export type GetAllSensorResponse = z.infer<typeof GetAllSensorResponseSchema>;

const GetSensorRequestSchema = GetEntityRequestSchema;

export type GetSensorRequest = z.infer<typeof GetSensorRequestSchema>;

const GetSensorResponseSchema = GetEntityResponseSchema;

export type GetSensorResponse = z.infer<typeof GetSensorResponseSchema>;

const UpdateSensorRequestSchema = z.object({
  id: z.number(),
  topic: z.string(),
});

export type UpdateSensorRequest = z.infer<typeof UpdateSensorRequestSchema>;

const UpdateSensorResponseSchema = UpdateEntityResponseSchema;

export type UpdateSensorResponse = z.infer<typeof UpdateSensorResponseSchema>;

const DeleteSensorRequestSchema = DeleteEntityRequestSchema;

export type DeleteSensorRequest = z.infer<typeof DeleteSensorRequestSchema>;

const DeleteSensorResponseSchema = DeleteEntityResponseSchema;

export type DeleteSensorResponse = z.infer<typeof DeleteSensorResponseSchema>;

// ===============
//  Dashboard
// ===============

const CreateDashboardRequestSchema = z.object({
  title: z.string(),
});

export type CreateDashboardRequest = z.infer<typeof CreateDashboardRequestSchema>;

const CreateDashboardResponseSchema = CreateContentfulEntityResponseSchema;

export type CreateDashboardResponse = z.infer<typeof CreateDashboardResponseSchema>;

const GetAllDashboardRequestSchema = GetAllContentfulEntityRequestSchema;

export type GetAllDashboardRequest = z.infer<typeof GetAllDashboardRequestSchema>;

const GetAllDashboardResponseSchema = GetAllContentfulEntityResponseSchema;

export type GetAllDashboardResponse = z.infer<typeof GetAllDashboardResponseSchema>;

const GetDashboardRequestSchema = GetContentfulEntityRequestSchema;

export type GetDashboardRequest = z.infer<typeof GetDashboardRequestSchema>;

const GetDashboardResponseSchema = GetContentfulEntityResponseSchema;

export type GetDashboardResponse = z.infer<typeof GetDashboardResponseSchema>;

const GetAllUserDashboardRequestSchema = z.object({
  username: z.string(),
});

export type GetAllUserDashboardRequest = z.infer<typeof GetAllUserDashboardRequestSchema>;

const UpdateDashboardRequestSchema = z.object({
  id: z.number(),
  title: z.string(),
});

export type UpdateDashboardRequest = z.infer<typeof UpdateDashboardRequestSchema>;

const UpdateDashboardResponseSchema = UpdateContentfulEntityResponseSchema;

export type UpdateDashboardResponse = z.infer<typeof UpdateDashboardResponseSchema>;

const DeleteDashboardRequestSchema = DeleteContentfulEntityRequestSchema;

export type DeleteDashboardRequest = z.infer<typeof DeleteDashboardRequestSchema>;

const DeleteDashboardResponseSchema = DeleteContentfulEntityResponseSchema;

export type DeleteDashboardResponse = z.infer<typeof DeleteDashboardResponseSchema>;

// ===============
//  Laboratory
// ===============

const CreateLaboratoryRequestSchema = z.object({
  name: z.string(),
  location: z.string(),
});

export type CreateLaboratoryRequest = z.infer<typeof CreateLaboratoryRequestSchema>;

const CreateLaboratoryResponseSchema = CreateEntityResponseSchema;

export type CreateLaboratoryResponse = z.infer<typeof CreateLaboratoryResponseSchema>;

const GetAllLaboratoryResponseSchema = GetAllEntityResponseSchema;

export type GetAllLaboratoryResponse = z.infer<typeof GetAllLaboratoryResponseSchema>;

const GetLaboratoryRequestSchema = GetEntityRequestSchema;

export type GetLaboratoryRequest = z.infer<typeof GetLaboratoryRequestSchema>;

const GetLaboratoryResponseSchema = GetEntityResponseSchema;

export type GetLaboratoryResponse = z.infer<typeof GetLaboratoryResponseSchema>;

const UpdateLaboratoryRequestSchema = z.object({
  id: z.number(),
  name: z.string(),
  location: z.string(),
});

export type UpdateLaboratoryRequest = z.infer<typeof UpdateLaboratoryRequestSchema>;

const UpdateLaboratoryResponseSchema = UpdateEntityResponseSchema;

export type UpdateLaboratoryResponse = z.infer<typeof UpdateLaboratoryResponseSchema>;

const DeleteLaboratoryRequestSchema = DeleteEntityRequestSchema;

export type DeleteLaboratoryRequest = z.infer<typeof DeleteLaboratoryRequestSchema>;

const DeleteLaboratoryResponseSchema = DeleteEntityResponseSchema;

export type DeleteLaboratoryResponse = z.infer<typeof DeleteLaboratoryResponseSchema>;

// ===============
//   Process Data
// ===============

const GetProcessDataRequestSchema = z.object({
  resolution: z.string(),
  offset: z.number(),
  topic: z.string().transform((val) => val.replace(/\./g, "/")),
});

export type GetProcessDataRequest = z.infer<typeof GetProcessDataRequestSchema>;

const GetProcessDataResponseSchema = z.object({
  data: z.any(),
});

export type GetProcessDataResponse = z.infer<typeof GetProcessDataResponseSchema>;
