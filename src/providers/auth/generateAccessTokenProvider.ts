import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
class GenerateAccessTokenProvider {
    async execute(user: User) {
        const token = jwt.sign({ role: user.role, email: user.email, username: user.username, confirmed: user.confirmed }, process.env.JWT_SECRET!, { expiresIn: '1h', issuer: 'auth', subject: user.id });
        return token;
    }
}
export { GenerateAccessTokenProvider }