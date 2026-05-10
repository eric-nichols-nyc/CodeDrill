import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
} from '@repo/schemas';
import { Prisma } from '../generated/prisma/client.js';
import type { Employee } from '../generated/prisma/client.js';
// biome-ignore lint/style/useImportType: Nest DI needs a runtime class token for constructor injection
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmployeesService {
  private readonly prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.prisma = prisma;
  }

  findAll(): Promise<Employee[]> {
    return this.prisma.employee.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number): Promise<Employee> {
    const row = await this.prisma.employee.findUnique({ where: { id } });
    if (!row) {
      throw new NotFoundException(`Employee #${id} not found`);
    }
    return row;
  }

  async create(payload: unknown): Promise<Employee> {
    const parsed = createEmployeeSchema.safeParse(payload);
    if (!parsed.success) {
      const detail = parsed.error.issues
        .map(
          (issue: { path: readonly PropertyKey[]; message: string }) =>
            `${issue.path.length > 0 ? issue.path.join('.') : 'body'}: ${issue.message}`,
        )
        .join('; ');
      throw new BadRequestException(detail || 'Invalid request body');
    }
    const dto = parsed.data;
    try {
      return await this.prisma.employee.create({
        data: {
          name: dto.name,
          email: dto.email,
          role: dto.role,
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(
          'An employee with this email already exists',
        );
      }
      throw e;
    }
  }

  async update(id: number, payload: unknown): Promise<Employee> {
    await this.findOne(id);
    const parsed = updateEmployeeSchema.safeParse(payload);
    if (!parsed.success) {
      const detail = parsed.error.issues
        .map(
          (issue: { path: readonly PropertyKey[]; message: string }) =>
            `${issue.path.length > 0 ? issue.path.join('.') : 'body'}: ${issue.message}`,
        )
        .join('; ');
      throw new BadRequestException(detail || 'Invalid request body');
    }
    const dto = parsed.data;
    const data: Prisma.EmployeeUpdateInput = {};
    if (dto.name !== undefined) {
      data.name = dto.name;
    }
    if (dto.email !== undefined) {
      data.email = dto.email;
    }
    if (dto.role !== undefined) {
      data.role = dto.role;
    }
    if (Object.keys(data).length === 0) {
      throw new BadRequestException('At least one field is required');
    }
    try {
      return await this.prisma.employee.update({
        where: { id },
        data,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(
          'An employee with this email already exists',
        );
      }
      throw e;
    }
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.employee.delete({ where: { id } });
  }
}
