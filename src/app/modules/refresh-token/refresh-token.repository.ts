import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { RefreshToken } from '@models/index';
import { CreateRefreshTokenDTO } from './dto/create-refresh-token.dto';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectModel(RefreshToken)
    private readonly refreshTokenModel: typeof RefreshToken
  ) { }


  public async findByTokenId(tokenId: string): Promise<RefreshToken | null> {
    const token = await this.refreshTokenModel.findOne({
      where: { tokenId }
    })

    return token;
  }

  async create(dto: CreateRefreshTokenDTO): Promise<RefreshToken> {
    const token = await this.refreshTokenModel.create(dto);
    
    return token;
  }

  public async deleteByTokenId(tokenId: string): Promise<void> {
    await this.refreshTokenModel.destroy({ 
      where: { tokenId }
     });
  }

  public async deleteExpiredTokens(): Promise<void> {
    await this.refreshTokenModel.destroy({ 
      where: { 
        expiresIn: {
          [Op.lt]: new Date()
        }
       }
     });

  }
}
