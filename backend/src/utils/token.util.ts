import jwt from 'jsonwebtoken';
import { jwtConfig } from '@config/jwt.config';

export class TokenUtil {
  static generateAccessToken(userId: string): string {
    return jwt.sign(
        { userId },
        jwtConfig.secret,
        {expiresIn: jwtConfig.expiresIn as jwt.SignOptions["expiresIn"],}
    );
  }

  /*
  *
  * payload: string | Buffer | object,
    secretOrPrivateKey: Secret | PrivateKey,
    options?: SignOptions,
  * */

  static generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, jwtConfig.refreshSecret, {
      expiresIn: jwtConfig.refreshExpiresIn as jwt.SignOptions["expiresIn"],
    });
  }

  static verifyAccessToken(token: string): any {
    try {
      return jwt.verify(token, jwtConfig.secret);
    } catch (error) {
      return null;
    }
  }

  static verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, jwtConfig.refreshSecret);
    } catch (error) {
      return null;
    }
  }
}