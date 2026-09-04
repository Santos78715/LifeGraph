import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateObservationDto } from './dto/create-observation.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';

@Injectable()
export class ObservationService {
  constructor(private prisma: PrismaService) {}

  create(createObservationDto: CreateObservationDto) {
    return this.prisma.observation.create({
      data: createObservationDto as Prisma.ObservationUncheckedCreateInput,
    });
  }

  findAll() {
    return this.prisma.observation.findMany({
      orderBy: { observedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const observation = await this.prisma.observation.findUnique({
      where: { id },
    });

    if (!observation) {
      throw new NotFoundException(`Observation ${id} not found`);
    }

    return observation;
  }

  async update(id: string, updateObservationDto: UpdateObservationDto) {
    await this.findOne(id);
    return this.prisma.observation.update({
      where: { id },
      data: updateObservationDto as Prisma.ObservationUncheckedUpdateInput,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.observation.delete({ where: { id } });
    return { message: `Observation ${id} has been deleted` };
  }
}
