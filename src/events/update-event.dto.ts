import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from 'src/events/create-event.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {}
