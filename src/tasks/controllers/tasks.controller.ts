// eslint-disable-next-line prettier/prettier
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { TasksService } from '../services/tasks.service';

/*main path api CRUD  Create endpoints*/

@Controller('api/tasks')
export class TasksController {
  constructor(private taskService: TasksService ) {}

  @Get()
  getAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.taskService.findOne(id);
  }

  @Post(':id')
  create(@Body() body: any) {
    return this.taskService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: any) {
    return this.taskService.update(id, body);
  }

  @Delete(':id')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  delete(@Param('id') id: number) {
    return this.taskService.remove(id);
  }
}
