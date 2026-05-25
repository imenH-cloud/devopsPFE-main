import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateActivityTable1698765432100 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create classroom table first (dependency)
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
              type: 'varchar',
              length: '500',
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

    // Create activity table
    const activityTableExists = await queryRunner.hasTable('activity');
    if (!activityTableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'activity',
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
              isNullable: false,
            },
            {
              name: 'type',
              type: 'varchar',
              length: '100',
              isNullable: true,
            },
            {
              name: 'description',
              type: 'text',
              isNullable: true,
            },
            {
              name: 'location',
              type: 'varchar',
              length: '255',
              isNullable: true,
            },
            {
              name: 'date',
              type: 'timestamp',
              isNullable: false,
            },
            {
              name: 'duration',
              type: 'integer',
              isNullable: false,
            },
            {
              name: 'isCompleted',
              type: 'boolean',
              default: false,
            },
            {
              name: 'classroomId',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'metadata',
              type: 'jsonb',
              isNullable: true,
            },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
            {
              name: 'updatedAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
              onUpdate: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
        true,
      );

      // Add foreign key
      await queryRunner.createForeignKey(
        'activity',
        new TableForeignKey({
          columnNames: ['classroomId'],
          referencedTableName: 'classroom',
          referencedColumnNames: ['id'],
          onDelete: 'SET NULL',
          name: 'FK_activity_classroom',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('activity');
    if (table) {
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('classroomId') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('activity', foreignKey);
      }
    }
    await queryRunner.dropTable('activity', true);
  }
}
