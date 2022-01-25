import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class MakeRentalEndDateNullable1643071018030
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'rentals',
      'end_date',
      new TableColumn({
        name: 'end_date',
        type: 'timestamp',
        isNullable: true,
      })
    );

    await queryRunner.changeColumn(
      'rentals',
      'total',
      new TableColumn({
        name: 'total',
        type: 'numeric',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'rentals',
      new TableColumn({
        name: 'end_date',
        type: 'timestamp',
        isNullable: true,
      }),
      new TableColumn({
        name: 'end_date',
        type: 'timestamp',
      })
    );

    await queryRunner.changeColumn(
      'rentals',
      new TableColumn({
        name: 'total',
        type: 'numeric',
        isNullable: true,
      }),
      new TableColumn({
        name: 'total',
        type: 'numeric',
      })
    );
  }
}
