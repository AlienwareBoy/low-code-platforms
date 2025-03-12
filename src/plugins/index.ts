export default async function (app: any) {
  const modules = import.meta.glob('./*.ts')
  for (const path in modules) {
    if (path !== './index.ts') {
      const module = (await modules[path]()) as any
      module.default(app)
    }
  }
}
