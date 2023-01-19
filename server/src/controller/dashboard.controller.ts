import { Controller, Get } from '@midwayjs/decorator';

@Controller('/dashboard/analysis')
export class HomeController {
  @Get('/')
  async home(): Promise<string> {
    return 'Hello Midwayjs!';
  }
}
