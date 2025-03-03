import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  private client = new OAuth2Client(
    '558699822073-bo52ighlvksekp2lj1q2b4f8stvi9a4r.apps.googleusercontent.com',
  );

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async verifyGoogleToken(token: string): Promise<User> {
    try {
      // Xác thực token với Google
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience:
          '558699822073-bo52ighlvksekp2lj1q2b4f8stvi9a4r.apps.googleusercontent.com',
      });

      const payload = ticket.getPayload();
      if (!payload) throw new UnauthorizedException('Xác thực Google thất bại');

      const email = payload.email;

      // Kiểm tra xem user đã tồn tại trong database chưa
      const user = await this.userRepository.findOne({
        where: { email },
        relations: ['doctor', 'doctor.degree', 'doctor.specialty', 'patient'],
      });
      return user;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException('Xác thực Google thất bại');
    }
  }
}
