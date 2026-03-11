import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    const logger = new Logger(GoogleStrategy.name);
    const clientID = process.env.GOOGLE_CLIENT_ID || '';
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';

    if (!clientID || !clientSecret) {
      logger.warn(
        'Google OAuth credentials are not defined in environment variables. Strategy initialized with empty credentials — OAuth flows will fail until credentials are provided.',
      );
    }

    super({
      clientID,
      clientSecret,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        'https://ideapulse-pathbridge.vercel.app/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { emails, displayName } = profile;
    return {
      email: emails?.[0]?.value,
      name: displayName,
    };
  }
}
