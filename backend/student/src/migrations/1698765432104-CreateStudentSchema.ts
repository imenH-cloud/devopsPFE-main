import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateStudentSchema1698765432104 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userTableExists = await queryRunner.hasTable('user');
    if (!userTableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'user',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            {
              name: 'email',
              type: 'varchar',
              length: '255',
              isUnique: true,
            },
            {
              name: 'firstName',
              type: 'varchar',
              length: '100',
            },
            {
              name: 'lastName',
              type: 'varchar',
              length: '100',
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

    const studentTableExists = await queryRunner.hasTable('student');
    if (!studentTableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'student',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            {
              name: 'userId',
              type: 'integer',
            },
            {
              name: 'age',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'tsaType',
              type: 'varchar',
              length: '100',
              isNullable: true,
            },
            {
              name: 'progress',
              type: 'integer',
              default: 0,
            },
            {
              name: 'medicalFile',
              type: 'text',
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

      await queryRunner.createForeignKey(
        'student',
        new TableForeignKey({
          columnNames: ['userId'],
          referencedTableName: 'user',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('student');
    const foreignKey = table?.foreignKeys.find((fk) => fk.columnNames.indexOf('userId') !== -1);
    if (foreignKey) {
      await queryRunner.dropForeignKey('student', foreignKey);
    }
    await queryRunner.dropTable('student', true);
  }
}
