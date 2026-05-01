import { Injectable, Logger } from '@nestjs/common';

/**
 * SMS abstraction layer. Swap the implementation body when a real provider
 * (Playmobile, Twilio, Eskiz, etc.) is connected — the interface stays stable.
 */
@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  async sendOtp(phoneNumber: string, code: string): Promise<void> {
    // TODO: replace with real SMS provider call
    // Example for Eskiz (popular in UZ):
    //   await this.httpService.post('https://notify.eskiz.uz/api/message/sms/send', {
    //     mobile_phone: phoneNumber.replace('+', ''),
    //     message: `Avimed tasdiqlash kodi: ${code}`,
    //   });
    this.logger.log(`[OTP] ${phoneNumber} → ${code}`);
  }

  generateOtp(length = 6): string {
    return String(Math.floor(Math.random() * 10 ** length)).padStart(length, '0');
  }
}
