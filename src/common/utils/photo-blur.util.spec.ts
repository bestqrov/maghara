import { toBlurredPhotoUrl, toTeaserProfile } from './photo-blur.util';

describe('photo-blur util', () => {
  it('injects the blur transformation into a Cloudinary URL', () => {
    expect(toBlurredPhotoUrl('https://res.cloudinary.com/demo/image/upload/v123/zawaj/a.jpg')).toBe(
      'https://res.cloudinary.com/demo/image/upload/e_blur:2000,w_300,q_30/v123/zawaj/a.jpg',
    );
  });

  it('refuses non-Cloudinary URLs', () => {
    expect(toBlurredPhotoUrl('https://images.unsplash.com/photo-1')).toBeNull();
  });

  it('withholds identifying fields and original photos from teasers', () => {
    const teaser = toTeaserProfile({
      firstName: 'Sara',
      jobTitle: 'Doctor',
      bio: 'Hi',
      waliPhone: '0600',
      gender: 'FEMALE',
      currentCity: 'Rabat',
      photos: ['https://res.cloudinary.com/demo/image/upload/a.jpg', 'https://res.cloudinary.com/demo/image/upload/b.jpg'],
    });
    expect(teaser.firstName).toBe('');
    expect(teaser).not.toHaveProperty('jobTitle');
    expect(teaser).not.toHaveProperty('bio');
    expect(teaser).not.toHaveProperty('waliPhone');
    expect(teaser.photos).toEqual(['https://res.cloudinary.com/demo/image/upload/e_blur:2000,w_300,q_30/a.jpg']);
  });
});
