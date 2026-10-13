import { decryptPhotoToken, encryptPhotoToken, toBlurredPhotoUrl, toTeaserProfile } from './photo-blur.util';

describe('photo-blur util', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
  });

  it('injects the blur transformation into a Cloudinary URL', () => {
    expect(toBlurredPhotoUrl('https://res.cloudinary.com/demo/image/upload/v123/zawaj/a.jpg')).toBe(
      'https://res.cloudinary.com/demo/image/upload/e_blur:2000,w_300,q_30/v123/zawaj/a.jpg',
    );
  });

  it('refuses non-Cloudinary URLs', () => {
    expect(toBlurredPhotoUrl('https://images.unsplash.com/photo-1')).toBeNull();
  });

  it('round-trips photo tokens and rejects tampered ones', () => {
    const url = 'https://res.cloudinary.com/demo/image/upload/v123/zawaj/a.jpg';
    const token = encryptPhotoToken(url);
    expect(token).not.toContain('zawaj');
    expect(decryptPhotoToken(token)).toBe(url);

    const tampered = token.slice(0, -2) + (token.endsWith('AA') ? 'BB' : 'AA');
    expect(decryptPhotoToken(tampered)).toBeNull();
    expect(decryptPhotoToken('garbage')).toBeNull();
  });

  it('withholds identifying fields and the original photo from teasers', () => {
    const teaser = toTeaserProfile(
      {
        firstName: 'Sara',
        jobTitle: 'Doctor',
        bio: 'Hi',
        waliPhone: '0600',
        gender: 'FEMALE',
        currentCity: 'Rabat',
        photos: ['https://res.cloudinary.com/demo/image/upload/a.jpg', 'https://res.cloudinary.com/demo/image/upload/b.jpg'],
      },
      'https://api.example.com',
    );
    expect(teaser.firstName).toBe('');
    expect(teaser).not.toHaveProperty('jobTitle');
    expect(teaser).not.toHaveProperty('bio');
    expect(teaser).not.toHaveProperty('waliPhone');
    expect(teaser.photos).toHaveLength(1);
    expect(teaser.photos[0]).toMatch(/^https:\/\/api\.example\.com\/public\/blurred-photo\/[A-Za-z0-9_-]+$/);
    expect(teaser.photos[0]).not.toContain('cloudinary');

    const token = teaser.photos[0].split('/').pop()!;
    expect(decryptPhotoToken(token)).toBe('https://res.cloudinary.com/demo/image/upload/a.jpg');
  });

  it('sends no photo for a non-Cloudinary cover', () => {
    const teaser = toTeaserProfile({ photos: ['https://images.unsplash.com/photo-1'] }, 'https://api.example.com');
    expect(teaser.photos).toEqual([]);
  });
});
