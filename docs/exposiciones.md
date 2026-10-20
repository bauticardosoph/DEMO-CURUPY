# Exposiciones y reconocimientos

Esta función se administra desde `/admin → Exposiciones`. Está preparada para ganado y caballos Criollos. No incluye participaciones ni premios ficticios y no requiere ejecutar SQL adicional.

## Crear una participación

1. Elegí **Nueva participación**.
2. Completá el nombre y el año. La fecha exacta, el lugar, la presentación y la historia son opcionales.
3. Cargá una portada si querés. La dirección de la página se propone automáticamente; conviene conservarla después de compartirla.
4. Agregá animales y resultados. Podés seleccionar una ficha existente o escribir un animal que todavía no esté en el catálogo.
5. Escribí el premio exacto y la categoría de la exposición. Un animal puede aparecer sin premio, como participante.
6. Activá **Dar protagonismo a este reconocimiento** para un gran premio. Esto lo presenta en un bloque especial dentro de esa participación. Podés ordenar los animales con las flechas.
7. Agregá fotos, pies de foto, fechas de las fotografías y enlaces de video, si corresponde. YouTube se reproduce dentro de la página.
8. Activá **Mostrar esta participación al publicar cambios** cuando esté lista.
9. Elegí **Guardar participación** y después **Publicar cambios**, en la barra superior.

Los campos vacíos no se muestran. La sección aparece en el menú únicamente cuando está habilitada y hay al menos una participación publicada. Cada cabaña guarda sus datos en su propia base.

## Relacionar animales y premios

El vínculo al catálogo utiliza el identificador del animal, no su nombre. Cambiar el nombre de la ficha no rompe esa relación. En la exposición se conserva el nombre que se escribió al registrar la participación.

El botón **Ver ficha** aparece solo si la ficha vinculada sigue publicada. Los premios se muestran también dentro de esa ficha, con un enlace a la exposición correspondiente. Si el animal se retira del catálogo, la participación histórica puede conservarse con su nombre, resultado y fotografía propios.

## Semen y embriones

Dentro de cada animal presentado se puede habilitar **Permitir consultas de semen** y/o **Permitir consultas de embriones**. Cada opción admite su propio enlace a una página de un centro genético o a WhatsApp y un nombre del responsable comercial.

Si no se carga un enlace específico, el botón utiliza el WhatsApp o teléfono configurado en **Página web → General**, con un mensaje que identifica al animal y su RP. Sin enlace ni teléfono configurado, el botón se oculta.

Estas opciones son independientes de **Vendido** en la ficha del ejemplar. Un animal vendido puede seguir recibiendo consultas sobre su genética. La disponibilidad y los enlaces se editan en la participación: revisalos cuando cambien las condiciones comerciales.

## Destacar un campeón en Inicio

En la configuración de **Exposiciones**:

1. Activá **Mostrar un destacado en Inicio**.
2. Elegí una participación marcada para mostrarse.
3. Elegí el animal o premio protagonista, o destacá toda la participación.
4. Elegí la ubicación: antes de Genética, después de Genética o después del Remate.
5. Guardá la configuración y publicá los cambios.

El bloque siempre identifica la exposición y el año. Si la participación se oculta o se quita, su destacado deja de aparecer automáticamente.

## Vista previa y visibilidad

**Vista previa** abre la participación con los cambios guardados, antes de publicarlos, y requiere iniciar sesión como administrador. Se puede revisar una participación oculta sin mostrarla al público. Los cambios que todavía no se guardaron en el editor no se incluyen en la vista previa.

Para ocultar una participación, desmarcá su visibilidad, guardá y publicá. Para ocultar toda la sección, desactivá **Mostrar Exposiciones en la web y el menú** y publicá. Los datos permanecen guardados para reutilizarlos.

## Qué se guarda

Los registros usan el sistema existente de contenido, borradores y versiones del sitio (`exhibitions_json`). Las imágenes usan la biblioteca de imágenes del sitio. No hay que cargar una migración ni modificar las tablas de animales. El código se entrega también en la plantilla para nuevas cabañas.
