import {z} from 'zod';
import {APIError} from 'shared/dist/types/apiErrors';

export interface APIResponse {
    data: object | null,
    error: APIError | null,
}

export const APIRequestSchema = z.object({
  data: z.object({

  }).optional(),
}).strict();
