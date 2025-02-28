import { AuthGuard } from '@nestjs/passport';

export class CompanyLocalAuthGuard extends AuthGuard('company-local') {}
