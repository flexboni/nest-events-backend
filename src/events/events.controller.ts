import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from 'src/events/attendee.entity';
import { Event } from 'src/events/event.entity';
import { EventsService } from 'src/events/events.service';
import { CreateEventDto } from 'src/events/input/create-event.dto';
import { ListEvents } from 'src/events/input/list.events';
import { UpdateEventDto } from 'src/events/input/update-event.dto';
import { Repository } from 'typeorm';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,

    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,

    private readonly eventsService: EventsService,
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async finalAll(@Query() filter: ListEvents) {
    const events =
      await this.eventsService.getEventsWithAttendeeCountFilteredPaginated(
        filter,
        {
          total: true,
          currentPage: filter.page,
          limit: 10,
        },
      );

    return events;
  }

  // @Get('practice')
  // /**
  //  * SELECT id, when
  //  *   FROM event
  //  *  WHERE (event.id > 3
  //  *    AND event.when > '2021-02-12T13:00:00)
  //  *     OR event.description LIKE '%meet%'
  //  *  ORDER BY event.id DESC
  //  *  LIMIT 2;
  //  */
  // async practice() {
  //   return await this.repository.find({
  //     select: ['id', 'when'],
  //     where: [
  //       {
  //         id: MoreThan(3),
  //         when: MoreThan(new Date('2021-02-12T13:00:00')),
  //       },
  //       {
  //         description: Like('%meet%'),
  //       },
  //     ],
  //     take: 2,
  //     order: {
  //       id: 'DESC',
  //     },
  //   });
  // }

  @Get('practice2')
  async practice2() {
    // return await this.repository.findOne({
    //   where: { id: 1 },
    //   relations: ['attendees'],
    // });

    // const event = await this.repository.findOne({ where: { id: 1 } });

    // const attendee = new Attendee();
    // attendee.name = 'Jerry';
    // attendee.event = event;

    // await this.attendeeRepository.save(attendee);

    // return attendee;

    return await this.repository
      .createQueryBuilder('e')
      .select(['e.id', 'e.name'])
      .orderBy('e.id', 'ASC')
      .take(3)
      .getMany();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    // return await this.repository.findOne(id);

    const event = await this.eventsService.getEvent(id);
    if (!event) {
      throw new NotFoundException();
    }

    return event;
  }

  @Post()
  async create(@Body(ValidationPipe) input: CreateEventDto) {
    await this.repository.save({
      ...input,
      when: new Date(input.when),
    });
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() input: UpdateEventDto) {
    const event = await this.repository.findOne(id);

    return await this.repository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id) {
    const result = await this.eventsService.deleteEvent(id);
    if (result?.affected !== 1) {
      throw new NotFoundException();
    }
  }
}
