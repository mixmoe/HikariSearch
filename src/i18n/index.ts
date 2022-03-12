export default async () => ({
  'en-US': (await import('./locales/en-US.json')).default,
});
