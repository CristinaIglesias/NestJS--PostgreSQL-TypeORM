
![logo](https://user-images.githubusercontent.com/68432004/142671675-918676ef-53f8-4a16-830b-725e8c56cf9f.png)


# NestJS-TypeORM-PostgreSQL
Create NestJs connection to PostgreSQL database using TypeORM.

## Resources
    https://nestjs.com/
    https://typeorm.io/#/
    https://hub.docker.com/_/postgres
    https://docs.docker.com/samples/postgresql_service/
    https://www.thunderclient.io/
## Create Project 
    npm i -g @nestjs/cli
    nest new tasks-api
    npm run start:dev
## Delete files we don't need for the project
  src/app.service.ts
  
  src/app.controller.ts
  
  src/app.controller.spec.ts
## Create module
    nest g mo tasks
    nest g s tasks/services/tasks
    nest g s tasks/services/tasks --flat
    nest g co tasks/controllers/tasks --flat
    
## Check endpoint and create CRUD
   src/tasks/controllers/tasks.controller.ts
   
      import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';

      @Controller('api/tasks')
      export class TasksControllerController {

        @Get()
        findAll() {
          return [1,2,3];
       }

        @Get(':id')
        findOne(@Param('id') id: number) {
          return id;
       }

        @Post()
        create(@Body() body: any) {
          return body;
        }

        @Put(':id')
        update(@Param('id') id: number, @Body() body: any) {
          return body;
        }

        @Delete(':id')
        delete(@Param('id') id: number) {
          return true;
        }

    }
  ## Install PostgreSQL Docker
        version: '3.3'

        services:
          postgres:
            image:postgres:13
            environment:
               - POSTGRES_DB= name_database
               - POSTGRES_USER= name_user
               - POSTGRES_PASSWORD= password_postgres
            ports:
               - '5432:5432'
            volumes:
               - ./postgres_data:/var/lib/postgresql
  ## Version WINDOWS add:
            ports:
               - '5432:5432'
            volumes:
               - ./postgres_data:/var/lib/postgresql
        volumes:
           postgresql-volume:
              external: true
              
   ## Add.gitignore/postgres_data
        docker-compose up -d postgres
        docker-compose exec postgres bash
        psql -h localhost -d my_db -U nico
        \d+
        \q
   ## Install TypeORM
        npm install --save @nestjs/typeorm typeorm pg
        
   ## App Module
   ### src/tasks/app.module.ts
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'name_user',
          password: 'password_postgres',
          database: 'name-database',
          entities: ['dist/**/*.entity{.ts,.js}'],
          synchronize: false,
          retryDelay: 3000,
          retryAttempts: 10
        }),
   ## Task Entity
   ### src/tasks/entities/task.entity.ts
        import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

        @Entity()
        export class Task {
          @PrimaryGeneratedColumn()
          id: number;

        @Column()
          name: string;

        @Column({ default: false })
          completed: boolean;
        }
   ## Tasks Module
   ### tasks.module.ts
        import { Module } from '@nestjs/common';
        import { TypeOrmModule } from '@nestjs/typeorm';

        import { Task } from './entities/task.entity';
        import { TasksService } from './services/tasks.service';
        import { TasksController } from './controllers/tasks.controller';

        @Module({
          imports: [
            TypeOrmModule.forFeature([Task])
          ],
          providers: [TasksService],
          controllers: [TasksController]
        })
        export class TasksModule {}
  ## Service
  ### src/tasks/service/tasks.service.ts
          import { Injectable } from '@nestjs/common';
          import { InjectRepository } from '@nestjs/typeorm';
          import { Repository } from 'typeorm';
          import { Task } from './../entities/task.entity';

          @Injectable()
          export class TasksService {

            constructor(
              @InjectRepository(Task) private tasksRepo: Repository<Task>,
            ) {}

            findAll() {
                return this.tasksRepo.find();
            }

            findOne(id: number) {
                return this.tasksRepo.findOne(id);
            }

            create(body: any) {
                const newTask = new Task();
                newTask.name = body.name;
                // const newTask = this.tasksRepo.create(body);
                return this.tasksRepo.save(newTask);
            }

            async update(id: number, body: any) {
                const task = await this.tasksRepo.findOne(id);
                this.tasksRepo.merge(task, body);
                return this.tasksRepo.save(task);
            }

            async remove(id: number) {
                await this.tasksRepo.delete(id);
                return true;
            }
          }
   ## Controller
   ### src/tasks/controllers/tasks.controller.ts
          import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';

          import { TasksService } from './../services/tasks.service';

          @Controller('api/tasks')
          export class TasksController {

            constructor(
              private tasksService: TasksService
            ) {}

          @Get()
          findAll() {
              return this.tasksService.findAll();
            }

          @Get(':id')
          findOne(@Param('id') id: number) {
              return this.tasksService.findOne(id);
            }

          @Post()
          create(@Body() body: any) {
              return this.tasksService.create(body);
            }

          @Put(':id')
          update(@Param('id') id: number, @Body() body: any) {
              return this.tasksService.update(id, body);
            }

          @Delete(':id')
          delete(@Param('id') id: number) {
              return this.tasksService.remove(id);
            }

          }
## Migrations
### Create ormconfig.json
        {
          "type": "postgres",
          "host": "localhost",
          "port": 5432,
          "username": "name_user",
          "password": "password_postgres",
          "database": "name_database",
          "entities": ["src/**/*.entity.ts"],
          "synchronize": false,
          "migrationsTableName": "migrations",
          "migrations": ["src/database/migrations/*.ts"],
          "cli": {
            "migrationsDir": "src/database/migrations"
          }       
        }
 ## Include in npm scripts in package.json
          "typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js",
          "migrations:generate": "npm run typeorm -- migration:generate -n",
          "migrations:run": "npm run typeorm -- migration:run",
 ## Generate migration -  initialize the schema
          npm run migrations:generate -- init
 ## Let’s run it
          npm run migrations:run
 ## Returns:
 ### src/database/migrations
          import { MigrationInterface, QueryRunner } from 'typeorm';

          export class init1637332095013 implements MigrationInterface {
             name = 'init1637332095013';

             public async up(queryRunner: QueryRunner): Promise<void> {
                await queryRunner.query(
                   `CREATE TABLE "task" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "completed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`,
              );
            }

            public async down(queryRunner: QueryRunner): Promise<void> {
              await queryRunner.query(`DROP TABLE "task"`);
              }
            }
  
 ## Set entity
 ### Update file tasks.entity.ts
          @CreateDateColumn({
            name: 'creation_at',
            type: 'timestamptz',
            default: () => 'CURRENT_TIMESTAMP',
          })
          creationAt: Date;

          @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
          updatedAt: Date;
  ## Update migration
          npm run migrations:generate -- change-tasks
  ## Let’s run it
          npm run migrations:run
  ## Returns:
  ### src/database/migrations
          import { MigrationInterface, QueryRunner } from 'typeorm';

          export class changeTasks1637340706463 implements MigrationInterface {
            name = 'changeTasks1637340706463';

            public async up(queryRunner: QueryRunner): Promise<void> {
              await queryRunner.query(
                 `ALTER TABLE "task" ADD "creation_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
            );
            await queryRunner.query(
                 `ALTER TABLE "task" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
            );
          }

          public async down(queryRunner: QueryRunner): Promise<void> {
              await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "updated_at"`);
              await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "creation_at"`);
            }
          }

  ## Testing in Database (Shell-docker postgres)
  ### Run project
          npm run start:dev
  ### Test in Database
          docker-compose up -d
          docker ps
          docker exec -it container-number bash
  ###  Into docker => into postgres
          psql -h localhost -d name_database -U name_user
  ###  Into my_database
          \d+
          \d task
          SELECT * FROM task;
          
          
          
          
  
          
          
      
