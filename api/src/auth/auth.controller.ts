import { Controller, Post, Body, UseGuards, Request, BadRequestException, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { email: string; password: string; name: string; timezone?: string },
    @Res() res: Response,
  ) {
    try {
      if (!body.email || !body.password || !body.name) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Email, password, and name are required',
        });
      }

      const result = await this.authService.register(
        body.email,
        body.password,
        body.name,
        body.timezone || 'UTC',
      );

      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: 'Email already exists',
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occurred during registration',
      });
    }
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    try {
      if (!body.email || !body.password) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Email and password are required',
        });
      }

      const user = await this.authService.validateUser(body.email, body.password);

      if (!user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid email or password',
        });
      }

      const result = await this.authService.login(user);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occurred during login',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  async getProfile(@Request() req: any, @Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Profile retrieved successfully',
      data: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        timezone: req.user.timezone,
        createdAt: req.user.createdAt,
        updatedAt: req.user.updatedAt,
      },
    });
  }
}
