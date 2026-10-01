# Cargar Curupy del Salvador en DEMO-CURUPY

Esta importación convierte la instalación vacía de la plantilla en la demo de Curupy. Incluye identidad, textos, imágenes, 5 fichas de animales, 10 artículos (7 PDF), 5 imágenes de galería, categorías y un remate. Las imágenes y documentos están en `public/curupy/` de este repositorio: no dependen del Netlify ni del Supabase anteriores.

## Antes de ejecutar

1. Confirmar que el último commit de `main` figure como **Published** en el proyecto Netlify `curupy-demo`. Esto garantiza que los archivos de `public/curupy/` existan cuando la base apunte a ellos.
2. Abrir el proyecto Supabase **whxwvvkwjcxwvpjvkmhr** (URL `https://whxwvvkwjcxwvpjvkmhr.supabase.co`). Deben estar aplicadas las migraciones `0000` a `0013` y creado el usuario administrador. No usar el Supabase anterior ni el de otra cabaña.
3. En **SQL Editor**, abrir [importar-curupy-demo.sql](./importar-curupy-demo.sql), copiar su contenido completo y ejecutarlo una sola vez. La consulta final devuelve los conteos importados.

El archivo SQL conserva el usuario y sus permisos. No importa consultas privadas ni contraseñas. Se puede ejecutar de nuevo si falló por completo (la transacción se revierte), pero **no conviene repetirlo después de editar animales en `/admin`**: actualiza las fichas importadas y reemplaza sus DEPs y su galería.

## Comprobación

La consulta final debe mostrar al menos: `site_content` 99, `site_images` 14, `animals` 5, `news_posts` 10, `gallery_media` 5 y `auctions` 1. Luego abrir:

- `https://curupy-demo.netlify.app/`
- `https://curupy-demo.netlify.app/genetica`
- `https://curupy-demo.netlify.app/actualidad`
- `https://curupy-demo.netlify.app/admin`

Verificar también una ficha PDF de animal y uno de los PDF de Actualidad. En Netlify, definir `NEXT_PUBLIC_SITE_URL=https://curupy-demo.netlify.app` si aún no existe, para los enlaces y metadatos de esta demo.

Esta web sigue siendo una **demo**: el título de portada dice “PÁGINA DE DEMO”. Los futuros cambios de textos, animales, noticias e imágenes pueden hacerse desde `/admin` y los archivos nuevos se almacenarán en el Supabase nuevo.
