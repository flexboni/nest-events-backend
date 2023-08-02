import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppKoreaService {
  constructor(
    @Inject('APP_NAME')
    private readonly name: string,
    @Inject('MESSAGE')
    private readonly message: string,
  ) {}

  getHello(): string {
    return `가나다라마 from ${this.name}, ${this.message}`;
  }
}
