import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
class GenerateRefreshTokenProvider {
    async execute(user: User) {
        const token = jwt.sign({ role: user.role, email: user.email, username: user.username, confirmed: user.confirmed }, process.env.JWT_REFRESH!, { expiresIn: '7d', issuer: 'auth', subject: user.id });
        return token;
    }
}
export { GenerateRefreshTokenProvider }