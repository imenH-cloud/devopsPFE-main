import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateClassroomSchema1698765432105 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const classroomTableExists = await queryRunner.hasTable('classroom');
    if (!classroomTableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'classroom',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            {
              name: 'name',
              type: 'varchar',
              length: '255',
            },
            {
              name: 'description',
              type: 'text',
              isNullable: true,
            },
            {
              name: 'capacity',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
        true,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('classroom', true);
  }
}
