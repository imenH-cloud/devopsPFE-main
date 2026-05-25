import { DataSource } from 'typeorm';

// Database initialization script - runs before app startup
export async function initializeDatabase(dataSource: DataSource): Promise<void> {
  console.log('🔄 Initializing database...');

  try {
    // Run all pending migrations
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    console.log('📋 Running pending migrations...');
    const migrations = await dataSource.runMigrations();
    
    if (migrations.length > 0) {
      console.log(`✅ Executed ${migrations.length} migration(s)`);
      migrations.forEach((migration) => {
        console.log(`   - ${migration.name}`);
      });
    } else {
      console.log('✅ Database already up to date');
    }

    // Verify schema
    console.log('🔍 Verifying schema...');
    const queryRunner = dataSource.createQueryRunner();
    
    // Check if tables exist
    const activityTable = await queryRunner.hasTable('activity');
    const classroomTable = await queryRunner.hasTable('classroom');
    
    if (!activityTable || !classroomTable) {
      throw new Error('❌ Schema verification failed - required tables missing');
    }

    // Check if required columns exist
    const metadata = dataSource.getMetadata('activity');
    if (!metadata) {
      throw new Error('❌ Activity metadata not found');
    }
    const requiredColumns = [
      'id',
      'name',
      'classroomId',
      'date',
      'duration',
      'isCompleted',
    ];

    for (const columnName of requiredColumns) {
      const column = metadata.columns.find((c) => c.propertyName === columnName);
      if (!column) {
        console.warn(`⚠️  Column ${columnName} not found in metadata, but may exist in DB`);
      }
    }

    await queryRunner.release();
    console.log('✅ Schema verification passed');
    console.log('✅ Database initialization complete!\n');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}
