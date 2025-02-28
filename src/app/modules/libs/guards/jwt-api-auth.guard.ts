import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


@Injectable()
export class JWTApiAuthGuard extends AuthGuard('jwt-api-access') {}
