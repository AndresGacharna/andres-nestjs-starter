import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  sku!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  // Campo sensible: el ClassSerializerInterceptor global lo quita de toda
  // respuesta, tanto en consultas como en acciones.
  @Exclude()
  @Column({ type: 'varchar', nullable: true })
  internalNotes?: string;
}
