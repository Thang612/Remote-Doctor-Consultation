import { Module } from '@nestjs/common';
import { VideoCallService } from './video-call.service';
import { VideoCallController } from './video-call.controller';

@Module({
  providers: [VideoCallService],
  controllers: [VideoCallController],
})
export class VideoCallModule {}
