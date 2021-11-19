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
