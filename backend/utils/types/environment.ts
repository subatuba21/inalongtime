import {Express} from 'express';
import {DBManager} from './dbManager';
import {Storage} from '@google-cloud/storage';

export type EnvironmentSetup = () => Promise<{
    server: Express,
    dbManager: DBManager,
    storage: Storage
}>
