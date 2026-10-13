import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { AuthService } from './auth.service';

function makeService(user: Record<string, any> | null) {
  const userModel = { findOne: jest.fn().mockResolvedValue(user) };
  const mailService = { send: jest.fn().mockResolvedValue(undefined) };
  const service = new AuthService(userModel as any, {} as any, {} as any, mailService as any);
  return { service, userModel, mailService };
}

describe('AuthService password reset', () => {
  it('emails a link whose token is stored only as a hash', async () => {
    const user: Record<string, any> = { _id: 'u1', email: 'sara@example.com', profile: { firstName: 'Sara' }, save: jest.fn() };
    const { service, mailService } = makeService(user);

    await service.requestPasswordReset('Sara@Example.com ', 'fr');

    const [to, , html] = mailService.send.mock.calls[0];
    expect(to).toBe('sara@example.com');
    const token = /reset-password\?token=([a-f0-9]+)/.exec(html)![1];
    expect(html).toContain('/fr/reset-password');
    expect(user.passwordResetTokenHash).toBe(createHash('sha256').update(token).digest('hex'));
    expect(user.passwordResetTokenHash).not.toBe(token);
    expect(user.passwordResetExpiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  it('does nothing visible for an unknown email', async () => {
    const { service, mailService } = makeService(null);
    await expect(service.requestPasswordReset('nobody@example.com', 'ar')).resolves.toBeUndefined();
    expect(mailService.send).not.toHaveBeenCalled();
  });

  it('sets the new password and burns the token', async () => {
    const user: Record<string, any> = { passwordHash: 'old', passwordResetTokenHash: 'h', save: jest.fn() };
    const { service, userModel } = makeService(user);

    await service.resetPassword('tok', 'newpassword');

    expect(userModel.findOne.mock.calls[0][0].passwordResetTokenHash).toBe(createHash('sha256').update('tok').digest('hex'));
    expect(await bcrypt.compare('newpassword', user.passwordHash)).toBe(true);
    expect(user.passwordResetTokenHash).toBeUndefined();
    expect(user.save).toHaveBeenCalled();
  });

  it('rejects an invalid or expired token', async () => {
    const { service } = makeService(null);
    await expect(service.resetPassword('bad', 'newpassword')).rejects.toBeInstanceOf(BadRequestException);
  });
});
