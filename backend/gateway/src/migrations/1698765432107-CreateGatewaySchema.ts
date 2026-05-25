import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateGatewaySchema1698765432107 implements MigrationInterface {
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
              name: 'role',
              type: 'varchar',
              length: '50',
              default: "'user'",
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
    await queryRunner.dropTable('user', true);
  }
}
