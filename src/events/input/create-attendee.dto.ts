import { IsEnum } from 'class-validator';
import { AttendeeAnswerEnum } from 'src/events/attendee.entity';

export class CreateAttendeeDto {
  @IsEnum(AttendeeAnswerEnum)
  answer: AttendeeAnswerEnum;
}
