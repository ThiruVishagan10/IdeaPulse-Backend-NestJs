import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';

const PLACEHOLDER = 'not-configured';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor() {
    const clientID = process.env.GOOGLE_CLIENT_ID || PLACEHOLDER;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || PLACEHOLDER;

    if (clientID === PLACEHOLDER || clientSecret === PLACEHOLDER) {
      new Logger(GoogleStrategy.name).warn(
        'Google OAuth credentials are not set. OAuth flows will fail until GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are configured.',
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
