import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateParentSchema1698765432103 implements MigrationInterface {
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

    const parentTableExists = await queryRunner.hasTable('parent');
    if (!parentTableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'parent',
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
              name: 'phoneNumber',
              type: 'varchar',
              length: '20',
              isNullable: true,
            },
            {
              name: 'address',
              type: 'varchar',
              length: '255',
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
        'parent',
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
    const table = await queryRunner.getTable('parent');
    const foreignKey = table?.foreignKeys.find((fk) => fk.columnNames.indexOf('userId') !== -1);
    if (foreignKey) {
      await queryRunner.dropForeignKey('parent', foreignKey);
    }
    await queryRunner.dropTable('parent', true);
  }
}
