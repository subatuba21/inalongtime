import {DBError} from '../../db/errors';

export interface DbResponse {
    success: boolean;
    error?: DBError;
}
