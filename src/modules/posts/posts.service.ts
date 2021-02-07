import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { POST_REPOSITORY } from '../../core/constants';
import { Post } from './entities/post.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @Inject(POST_REPOSITORY) private readonly postRepository: typeof Post,
  ) {}

  async create(createPostDto: CreatePostDto, userId: number): Promise<Post> {
    return await this.postRepository.create<Post>({ ...createPostDto, userId });
  }

  async findAll(): Promise<Post[]> {
    return await this.postRepository.findAll<Post>({
      include: [{ model: User, attributes: { exclude: ['password'] } }],
    });
  }

  async findOne(id: number): Promise<Post> {
    return await this.postRepository.findOne<Post>({
      where: { id },
      include: [{ model: User, attributes: { exclude: ['password'] } }],
    });
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    userId: number,
  ): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id, userId } });
    if (!post) throw new NotFoundException('This post does not exist');

    return await post.update({ ...updatePostDto });
  }

  async remove(id: number, userId: number): Promise<number> {
    return await this.postRepository.destroy({ where: { id, userId } });
  }
}
