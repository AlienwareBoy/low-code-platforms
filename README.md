# 注意事项

## 接口地址注意修改

vite.config.ts

```
'/api': {
    target: 'http://192.168.3.9:3000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
},
```

.env.development

```
VITE_API_URL=http://192.168.3.9:3000
VITE_DEBUG=true
VITE_BASE_URL=/dev/

```
