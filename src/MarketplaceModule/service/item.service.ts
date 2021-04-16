import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Item, PrismaPromise } from '@prisma/client';
import { v4 } from 'uuid';
import slugify from 'slugify';
import * as path from 'path';
import { UploadService } from './upload.service';
import { QueryItemDTO } from '../dto/query-item.dto';
import { CreateItemDTO } from '../dto/create-item.dto';
import { ItemRepository } from '../repository/item.repository';
import { PrismaService } from '../../PrismaModule/service/prisma.service';
import { PageableDTO } from '../../CommonsModule/dto/pageable.dto';
import { ErrorObject } from '../../CommonsModule/dto/error-object.dto';

@Injectable()
export class ItemService {
  constructor(
    private readonly repository: ItemRepository,
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  public async getAll(query: QueryItemDTO): Promise<PageableDTO<Item>> {
    const { page, limit, orderBy, ...other } = query;
    const items = await this.prisma.item.findMany({
      where: other,
      skip: limit * (page - 1),
      take: limit,
      orderBy,
    });
    await this.prisma.item.count();
    let itemsWithPhoto = [];
    for (const item of items) {
      itemsWithPhoto = [
        ...itemsWithPhoto,
        { ...item, photo: await this.uploadService.getItemPhoto(item.photo) },
      ];
    }
    return new PageableDTO({
      content: itemsWithPhoto,
      limit: limit * (page - 1),
      page,
      totalElements: await this.prisma.item.count(),
    });
  }

  public async create({
    file,
    ...item
  }: CreateItemDTO & { file: Express.Multer.File }) {
    const acceptedFileExtensions = ['.png', '.jpg', '.jpeg'];
    const fileExtension = path.extname(file.originalname);

    if (!acceptedFileExtensions.includes(fileExtension)) {
      const customErrorMessage = `Accepted file types are ${acceptedFileExtensions.join(
        ',',
      )}, you upload a ${fileExtension} file`;
      throw new BadRequestException(
        new ErrorObject('WRONG_FILE_EXTENSION').customMessage(
          customErrorMessage,
        ),
      );
    }

    const id = v4();
    const photoPath = `${id}/photo${fileExtension}`;

    await this.uploadService.uploadItemPhoto(photoPath, file.buffer);
    return this.prisma.item.create({
      data: {
        ...item,
        id,
        slug: slugify(item.name, { lower: true, strict: true }),
        photo: photoPath,
      },
    });
  }

  public async findBySlug(slug: string): Promise<Item> {
    const item: Item = await this.prisma.item.findFirst({
      where: { slug: { contains: slug } },
    });
    if (!item) {
      throw new NotFoundException(
        new ErrorObject('WRONG_FILE_EXTENSION').customMessage(
          `Item with slug "${slug}" not found`,
        ),
      );
    }
    return {
      ...item,
      photo: await this.uploadService.getItemPhoto(item.photo),
    };
  }

  public async findAvailableById(
    {
      id,
      minQuantity,
    }: {
      id: string;
      minQuantity: number;
    } = { id: null, minQuantity: 0 },
  ) {
    const availableItem = await this.repository.findAvailableById({
      id,
      minQuantity: minQuantity,
    });
    if (!availableItem) {
      throw new BadRequestException(
        new ErrorObject('NOT_IN_STOCK').customMessage(
          `Item with id ${id} doesn't have the ordered quantity`,
        ),
      );
    }
    return availableItem;
  }

  public async findById(id: string) {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new BadRequestException(
        new ErrorObject('ITEM_NOT_FOUND').customMessage(
          `Item with id ${id} doesn't exist`,
        ),
      );
    }
    return item;
  }

  public async incrementItemQuantity(
    id: string,
    quantity: number,
  ): Promise<void> {
    await this.prisma.item.update({
      data: { quantity: { increment: quantity } },
      where: { id },
    });
  }

  public async decrementItemQuantity(
    id: string,
    quantity: number,
  ): Promise<PrismaPromise<void>> {
    await this.prisma.item.update({
      data: { quantity: { decrement: quantity } },
      where: { id },
    });
  }
}
