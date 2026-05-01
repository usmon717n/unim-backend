import { Controller, Get, Put, Post, Delete, Param, Body } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  // Profile endpoints
  @Get('profile')
  getProfile() {
    return this.accountService.getProfile();
  }

  @Put('profile')
  updateProfile(@Body() updateProfileDto: any) {
    return this.accountService.updateProfile(updateProfileDto);
  }

  // Avimed Pass endpoints
  @Get('avimed-pass')
  getAvimedPass() {
    return this.accountService.getAvimedPass();
  }

  @Put('avimed-pass')
  updateAvimedPass(@Body() updateAvimedPassDto: any) {
    return this.accountService.updateAvimedPass(updateAvimedPassDto);
  }

  // Documents endpoints
  @Get('documents')
  getDocuments() {
    return this.accountService.getDocuments();
  }

  @Post('documents')
  addDocument(@Body() addDocumentDto: any) {
    return this.accountService.addDocument(addDocumentDto);
  }

  @Put('documents/:id')
  updateDocument(@Param('id') id: string, @Body() updateDocumentDto: any) {
    return this.accountService.updateDocument(id, updateDocumentDto);
  }

  @Delete('documents/:id')
  deleteDocument(@Param('id') id: string) {
    return this.accountService.deleteDocument(id);
  }

  // Payment cards endpoints
  @Get('payment-cards')
  getPaymentCards() {
    return this.accountService.getPaymentCards();
  }

  @Post('payment-cards')
  addPaymentCard(@Body() addPaymentCardDto: any) {
    return this.accountService.addPaymentCard(addPaymentCardDto);
  }

  @Delete('payment-cards/:id')
  deletePaymentCard(@Param('id') id: string) {
    return this.accountService.deletePaymentCard(id);
  }

  // Security endpoints
  @Get('security')
  getSecuritySettings() {
    return this.accountService.getSecuritySettings();
  }

  @Put('security')
  updateSecuritySettings(@Body() updateSecurityDto: any) {
    return this.accountService.updateSecuritySettings(updateSecurityDto);
  }

  @Put('security/password')
  changePassword(@Body() changePasswordDto: any) {
    return this.accountService.changePassword(changePasswordDto);
  }

  @Put('security/biometric')
  toggleBiometric(@Body() toggleBiometricDto: any) {
    return this.accountService.toggleBiometric(toggleBiometricDto);
  }

  // Connected devices endpoints
  @Get('devices')
  getConnectedDevices() {
    return this.accountService.getConnectedDevices();
  }

  @Delete('devices/:id')
  removeDevice(@Param('id') id: string) {
    return this.accountService.removeDevice(id);
  }

  // Wearables endpoints
  @Get('wearables')
  getWearables() {
    return this.accountService.getWearables();
  }

  @Put('wearables/:id/sync')
  syncWearable(@Param('id') id: string) {
    return this.accountService.syncWearable(id);
  }
}
