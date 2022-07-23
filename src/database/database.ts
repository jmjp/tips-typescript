import { PrismaClient } from '@prisma/client'
import { loggerDB } from '../middlewares/loggers/DatabaseLogger';

const prismaClient = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

prismaClient.$use(loggerDB)

export { prismaClient };