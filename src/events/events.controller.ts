import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from 'src/events/attendee.entity';
import { CreateEventDto } from 'src/events/create-event.dto';
import { Event } from 'src/events/event.entity';
import { UpdateEventDto } from 'src/events/update-event.dto';
import { Repository } from 'typeorm';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,

    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
  ) {}

  @Get()
  async finalAll() {
    this.logger.log(`Hit the findAll route`);

    const events = await this.repository.find();

    this.logger.debug(`Found ${events.length} events`);

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

    const event = await this.repository.findOne({ where: { id: 1 } });

    const attendee = new Attendee();
    attendee.name = 'Jerry';
    attendee.event = event;

    await this.attendeeRepository.save(attendee);

    return attendee;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id) {
    return await this.repository.findOne(id);
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
    const event = await this.repository.findOne(id);
    return await this.repository.remove(event);
  }
}
