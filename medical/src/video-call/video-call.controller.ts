import { Controller, Get, Query } from '@nestjs/common';
import { VideoCallService } from './video-call.service';

@Controller('videocall')
export class VideoCallController {
  constructor(private readonly videoCallService: VideoCallService) {}

  @Get('generate-token')
  generateToken(@Query('channel') channel: string, @Query('uid') uid: string) {
    const token = this.videoCallService.generateToken(channel, Number(uid));
    return { token };
  }
}
