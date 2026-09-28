import { Controller, Get, Patch, Param, Module, Injectable } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';

@Injectable()
export class NotificationsService {
  async findMyNotifications(userId: string) {
    return [
      {
        id: '1',
        title: 'Caisse journalière ouverte',
        message: 'La session de caisse du jour a été initialisée avec un fond de 50 000 FCFA.',
        type: 'INFO',
        is_read: false,
        created_at: new Date().toISOString(),
      },
    ];
  }

  async markAsRead(id: string, userId: string) {
    return { id, is_read: true };
  }
}

@ApiTags('notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('my')
  @ApiOperation({ summary: 'Lister les notifications de l’utilisateur connecté' })
  async getMyNotifications(@CurrentUser() user: AuthenticatedUser) {
    return this.notificationsService.findMyNotifications(user.id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marquer une notification comme lue' })
  async markAsRead(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.notificationsService.markAsRead(id, user.id);
  }
}

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
