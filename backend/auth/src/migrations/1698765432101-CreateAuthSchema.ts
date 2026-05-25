import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateAuthSchema1698765432101 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create user table if not exists
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
              name: 'password',
              type: 'varchar',
              length: '255',
            },
            {
              name: 'firstName',
              type: 'varchar',
              length: '100',
              isNullable: true,
            },
            {
              name: 'lastName',
              type: 'varchar',
              length: '100',
              isNullable: true,
            },
            {
              name: 'role',
              type: 'varchar',
              length: '50',
              default: "'user'",
            },
            {
              name: 'isActive',
              type: 'boolean',
              default: true,
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
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user', true);
  }
}
