import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Request,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postsService.create(createPostDto, req.user.sub);
  }

  @Get()
  async findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const post = await this.postsService.findOne(+id);
    if (!post) throw new NotFoundException('Post does not exist');

    return post;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req,
  ) {
    return this.postsService.update(+id, updatePostDto, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req) {
    const deleted = await this.postsService.remove(id, req.user.sub);
    if (deleted === 0) throw new NotFoundException('This post does not exist');

    return deleted;
  }
}
