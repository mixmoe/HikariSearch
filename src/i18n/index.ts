export default async () => ({
  'zh-CN': (await import('./locales/zh-CN.json')).default,
});
