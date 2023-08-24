import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Attendee } from 'src/events/attendee.entity';
import { AttendeesService } from 'src/events/attendees.service';
import { CurrentUserEventAttendanceController } from 'src/events/current-user-event-attendance.controller';
import { EventAttendeesController } from 'src/events/event-attendees.controller';
import { Event } from 'src/events/event.entity';
import { EventsController } from 'src/events/events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Attendee])],
  controllers: [
    EventsController,
    EventAttendeesController,
    CurrentUserEventAttendanceController,
  ],
  providers: [EventsService, AttendeesService],
})
export class EventsModule {}
