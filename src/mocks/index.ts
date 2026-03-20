import { authHandlers } from './handlers/auth';
import { imagesHandlers } from './handlers/images';
import { userHandlers } from './handlers/user';

export const handlers = [...authHandlers, ...userHandlers, ...imagesHandlers];
