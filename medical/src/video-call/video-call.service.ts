import { Injectable } from '@nestjs/common';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

@Injectable()
export class VideoCallService {
  private appId = '718f01f1af4847bfa65a2cb1bb454b00'; // Thay bằng Agora App ID của bạn
  private appCertificate = 'e92ac28716584ecca43278ae256e688d'; // Thay bằng Agora App Certificate của bạn

  generateToken(channelName: string, uid: number): string {
    const expirationTimeInSeconds = 3600; // Token hết hạn sau 1 giờ
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      this.appId,
      this.appCertificate,
      channelName,
      uid,
      RtcRole.PUBLISHER,
      privilegeExpiredTs,
    );

    return token;
  }
}
