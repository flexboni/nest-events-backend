import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AttendeesService } from 'src/events/attendees.service';
import { EventsService } from 'src/events/events.service';
import { CreateAttendeeDto } from 'src/events/input/create-attendee.dto';

@Controller('events-attendance')
@SerializeOptions({ strategy: 'excludeAll' })
export class CurrentUserEventAttendanceController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly attendeesService: AttendeesService,
  ) {}

  @Get()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@CurrentUser() user, @Query('page') page = 1) {
    return await this.eventsService.getEventsAttendedByUserIdPaginated(
      user.id,
      { limit: 6, currentPage: page },
    );
  }

  @Get('/:eventId')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(
    @Param('eventId', ParseIntPipe) eventId: number,
    @CurrentUser() user,
  ) {
    const attendee = await this.attendeesService.findOneByEventIdAndUserId(
      eventId,
      user.id,
    );
    if (!attendee) {
      throw new NotFoundException();
    }

    return attendee;
  }

  @Put('/:eventId')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async createOrUpdate(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() input: CreateAttendeeDto,
    @CurrentUser() user,
  ) {
    return await this.attendeesService.createOrUpdate(input, eventId, user.id);
  }
}
