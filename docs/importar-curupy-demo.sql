-- Importación DEMO-CURUPY desde la demo pública, 01/10/2026.
-- Ejecutar SOLO en el proyecto whxwvvkwjcxwvpjvkmhr con migraciones 0000–0013.
-- No incluye usuarios, contraseñas ni consultas privadas.
BEGIN;

INSERT INTO public.cabins (id,slug,name) VALUES (1,'demo-curupy','Curupy del Salvador') ON CONFLICT (id) DO UPDATE SET slug=EXCLUDED.slug,name=EXCLUDED.name;

INSERT INTO public.site_content (cabin_id,content_key,value,draft_value) VALUES
(1,'cabana_title_line_2','Curupy del Salvador.',NULL),
(1,'cabana_lead','La estancia está situada sobre los ríos San Salvador y Uruguay, en el departamento de Soriano. Un sistema pastoril, trabajo profesional y una búsqueda permanente de mejora hicieron de Curupy un referente para la raza en Uruguay.',NULL),
(1,'history_present_copy','La selección actual combina apreciación visual, información de DEPs y padres nacionales, argentinos, norteamericanos y propios. Se exige historia reproductiva, buenos aplomos, facilidad de parto, leche controlada y características de carcasa. Desde 2013 se terminan novillos para Cuota 481 de High Quality Beef, con resultados destacados de ganancia diaria, eficiencia de conversión y peso de carcasa.',NULL),
(1,'history_selection_title','Selección genética y adaptación',NULL),
(1,'history_production_title','Sistema productivo',NULL),
(1,'history_present_title','Trabajo actual',NULL),
(1,'history_sales_title','Venta, tradición y rumbo',NULL),
(1,'genetics_cycle_title','Generación 2022 · Cuota 481 HQB',NULL),
(1,'establishment_name','Estancia Curupy del Salvador',NULL),
(1,'establishment_location','Ruta 96 · Dolores, Soriano · Uruguay',NULL),
(1,'genetics_line_1','Genética dúctil.',NULL),
(1,'genetics_line_2','Datos y campo.',NULL),
(1,'genetics_title','Eficiencia al proceso productivo y valor al producto final',NULL),
(1,'genetics_cycle_copy','Los resultados del último ciclo confirmaron el rumbo del programa: 134 días de corral, 1,94 kg de ganancia diaria y animales funcionales, adaptados al sistema productivo.',NULL),
(1,'stat_1_value','+60',NULL),
(1,'stat_1_label','años de cría Aberdeen Angus',NULL),
(1,'stat_2_value','350–400',NULL),
(1,'stat_2_label','terneros evaluados por año',NULL),
(1,'stat_3_value','11.500+',NULL),
(1,'stat_3_label','animales Curupy evaluados',NULL),
(1,'criollos_title_line_1','Criollos en',NULL),
(1,'criollos_title_line_2','Curupy del Salvador.',NULL),
(1,'criollos_story_3','En Curupy se seleccionan los mejores padrillos de cada generación. También se ofrecen yeguas con descendencia probada y, ocasionalmente, caballos mansos de trabajo y potros.',NULL),
(1,'gallery_eyebrow','El campo, los animales y nuestra gente',NULL),
(1,'gallery_title_line_1','Galería',NULL),
(1,'gallery_title_line_2','de la cabaña.',NULL),
(1,'contact_line_1','Estamos en',NULL),
(1,'contact_line_2','Dolores, Soriano.',NULL),
(1,'contact_intro','Consultas sobre genética Angus, reproductores, Criollos y visitas al establecimiento.',NULL),
(1,'contact_email','',NULL),
(1,'contact_phone','Ing. Bautista Cardoso · +598 91 088 716',NULL),
(1,'contact_whatsapp','https://wa.me/59891088716',NULL),
(1,'contact_location','Ruta 96 · Dolores, Soriano · Uruguay',NULL),
(1,'social_instagram','https://www.instagram.com/curupydelsalvador/',NULL),
(1,'social_facebook','',NULL),
(1,'institutional_video','https://youtu.be/SUlcJoCk26w',NULL),
(1,'font_size_titles','normal',NULL),
(1,'font_size_body','large',NULL),
(1,'typography_style','editorial',NULL),
(1,'color_palette','monte',NULL),
(1,'show_home_intro','true',NULL),
(1,'show_home_establishment','false',NULL),
(1,'show_home_genetics','true',NULL),
(1,'show_home_news_carousel','true',NULL),
(1,'show_home_gallery_carousel','true',NULL),
(1,'home_news_carousel_position','after_auction',NULL),
(1,'home_gallery_carousel_position','after_auction',NULL),
(1,'home_auction_position','before_genetics',NULL),
(1,'seo_keywords','genética Angus, Aberdeen Angus, cabaña ganadera, reproductores, Curupy del Salvador, Uruguay, angus, criollos, cabaña',NULL),
(1,'social_youtube','https://www.youtube.com/@CurupyDelSalvador',NULL),
(1,'show_story_values','true',NULL),
(1,'show_genetics_program','true',NULL),
(1,'history_territory_copy','La Estancia Curupy del Salvador está situada sobre los ríos San Salvador y Uruguay, en el departamento de Soriano. Sus campos combinan ambientes naturales de bañados, monte indígena y una amplia superficie de potreros productivos.',NULL),
(1,'auction_notice_title','',NULL),
(1,'auction_notice_message','',NULL),
(1,'auction_promotion_id','1',NULL),
(1,'auction_notice_enabled','true',NULL),
(1,'auction_notice_start','2026-09-28T10:35',NULL),
(1,'auction_notice_end','2026-09-28T19:35',NULL),
(1,'home_auction_live_enabled','true',NULL),
(1,'home_auction_live_position','after_hero',NULL),
(1,'home_auction_live_title','',NULL),
(1,'home_hero_line_1','PÁGINA',NULL),
(1,'home_hero_line_2','DE DEMO',NULL),
(1,'home_hero_copy','Más de 60 años seleccionando animales funcionales, adaptables y eficientes en condiciones reales de producción.',NULL),
(1,'cabana_story_1','A fines de 1958 Jorge Alberto Mailhos se hizo cargo de Curupy del Salvador, iniciando la cabaña Angus a principios de la década del 70. Los planteles comenzaron con vientres de Ipoa y Las Flechas, incorporando luego genética nacional, argentina y norteamericana.',NULL),
(1,'cabana_year','1958',NULL),
(1,'history_origins_title','Orígenes de la cabaña',NULL),
(1,'history_territory_title','Territorio y ambiente',NULL),
(1,'history_production_copy','Curupy realiza ciclo completo, terminando novillos y vaquillonas. El manejo combina campo natural, praderas implantadas, agricultura de secano y terminación a corral. Desde la generación 2000 participa del Servicio de Evaluación de Reproductores Angus aportando entre 350 y 400 terneros por año. En 2004 comenzó el programa de trasplante embrionario.',NULL),
(1,'history_sales_copy','La cabaña comercializa toros para rodeos y planteles, vientres Pedigrí y Puro Controlado, embriones y semen. Mantiene las tradiciones de la ganadería uruguaya y utiliza caballos criollos para un manejo racional del ganado, con el bienestar animal como prioridad.',NULL),
(1,'genetics_copy','Curupy desarrolla un programa genético con amplia base y gran presión de selección, poniendo énfasis en fertilidad, rusticidad, peso y carcasa. El objetivo es producir ganados dúctiles, capaces de adaptarse a distintos ambientes y contingencias productivas. Más de 11.500 animales de Curupy han sido evaluados dentro de la población nacional.',NULL),
(1,'actualidad_intro','',NULL),
(1,'contact_map','https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d426254.89084700285!2d-58.329439237953764!3d-33.420211252084194!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xa61be6d601962b52!2sCurupy%20del%20Salvador!5e0!3m2!1sen!2suy!4v1606703457054!5m2!1sen!2suy',NULL),
(1,'show_history_chapters','true',NULL),
(1,'history_selection_copy','La cabaña prioriza toros propios producidos y criados en el establecimiento, buscando genética adaptada a las condiciones de monte ribereño. Los ejemplares se eligen por tipicidad Angus, profundidad de costilla, tamaño moderado y estructura, junto con DEPs para peso al nacer, peso final, circunferencia escrotal y área de ojo de bife. Desde hace tres décadas se aplica un criterio determinante: vaca que falla se aparta del plantel.',NULL),
(1,'seo_title','Curupy del Salvador | Genética Angus',NULL),
(1,'show_genetics_catalog','true',NULL),
(1,'show_criollos','true',NULL),
(1,'show_news','true',NULL),
(1,'show_contact','true',NULL),
(1,'show_animal_watermark','true',NULL),
(1,'show_cabana_watermark','true',NULL),
(1,'show_home_auction','false',NULL),
(1,'brand_name','Curupy del Salvador',NULL),
(1,'brand_tagline','Precisión en genética de producción',NULL),
(1,'seo_description','Curupy del Salvador: precisión en genética de producción, Aberdeen Angus y Criollos en Dolores, Soriano, Uruguay.',NULL),
(1,'home_intro_eyebrow','Mejoramiento genético',NULL),
(1,'home_intro_line_1','Valores objetivos.',NULL),
(1,'home_intro_line_2','Resultados consistentes.',NULL),
(1,'home_intro_copy','Curupy del Salvador se mantiene a la vanguardia del mejoramiento genético, combinando información objetiva con una presión selectiva constante.',NULL),
(1,'cabana_eyebrow','60 años de cría Aberdeen Angus',NULL),
(1,'cabana_title_line_1','Angus en',NULL),
(1,'show_gallery','true',NULL),
(1,'cabana_story_2','Curupy trabaja con animales versátiles, adaptados, productivos y económicos de mantener. La apreciación visual se complementa con información objetiva y una fuerte presión de selección por fertilidad, facilidad de parto, crecimiento y calidad de carcasa.',NULL),
(1,'history_origins_copy','A fines de 1958 Jorge Alberto Mailhos se hizo cargo de Curupy del Salvador y comenzó la cabaña Angus a principios de la década del 70. Los planteles se iniciaron con unas 60 vacas preñadas de Ipoa y Las Flechas. En 1981 se incorporaron vientres de Las Lilas y en 1989 se utilizó el primer padre de producción propia, Halcón 149.',NULL),
(1,'criollos_lead','Una complementación perfecta para el trabajo diario del campo.',NULL),
(1,'criollos_story_1','Las caballadas de Curupy se formaron con los criterios de Don Jorge A. Mailhos, quien buscaba en el caballo criollo un compañero confiable, imprescindible e insustituible para el trabajo diario. La selección exige aplomos, fortaleza de lomo, estructura, hueso, tipicidad, disposición al trabajo y buen temperamento.',NULL),
(1,'criollos_story_2','Los orígenes se remontan a 1940, cuando se inscribieron los primeros potrillos con el sufijo Oriental. En 1967 la mayoría de las manadas llegaron a Curupy del Salvador, sobre las costas del San Salvador. Las yeguas se prueban durante años en el trabajo de la estancia antes de incorporarse a la manada.',NULL)
ON CONFLICT (cabin_id,content_key) DO UPDATE SET value=EXCLUDED.value,draft_value=NULL,updated_at=NOW();

INSERT INTO public.site_images (cabin_id,image_key,label,storage_key,draft_storage_key,fallback_url) VALUES
(1,'brand-logo','Marca principal',NULL,NULL,'/curupy/brand.png'),
(1,'brand-watermark','Marca de la estancia',NULL,NULL,'/curupy/watermark.svg'),
(1,'auction-1','Imagen de 38 remate Anual',NULL,NULL,'/curupy/site-auction-1.jpg'),
(1,'site-icon','Ícono del sitio',NULL,NULL,'/curupy/site-site-icon.png'),
(1,'seo-share','Vista previa al compartir',NULL,NULL,'/curupy/site-seo-share.png'),
(1,'home-hero','Portada principal',NULL,NULL,'/curupy/site-home-hero.jpg'),
(1,'brand-pdf','Marca para fichas PDF (opcional)',NULL,NULL,'/curupy/site-brand-pdf.png'),
(1,'establishment','establishment',NULL,NULL,'/curupy/site-establishment.jpg'),
(1,'genetics-hero','genetics-hero',NULL,NULL,'/curupy/site-genetics-hero.jpg'),
(1,'genetics-cycle','genetics-cycle',NULL,NULL,'/curupy/site-genetics-cycle.jpg'),
(1,'criollos-hero','criollos-hero',NULL,NULL,'/curupy/site-criollos-hero.jpg'),
(1,'contact','contact',NULL,NULL,'/curupy/site-contact.jpg'),
(1,'animal-gallery-secondary','animal-gallery-secondary',NULL,NULL,'/curupy/site-animal-gallery-secondary.jpg'),
(1,'animal-gallery-tertiary','animal-gallery-tertiary',NULL,NULL,'/curupy/site-animal-gallery-tertiary.jpg')
ON CONFLICT (cabin_id,image_key) DO UPDATE SET label=EXCLUDED.label,storage_key=NULL,draft_storage_key=NULL,fallback_url=EXCLUDED.fallback_url,updated_at=NOW();

INSERT INTO public.animal_categories (cabin_id,name,slug,sort_order,active,catalog_section,kind) VALUES
(1,'TOROS PI Y PC','toros-pi-y-pc',0,TRUE,'genetics','category'),
(1,'Padrillo','padrillo',0,TRUE,'criollos','category'),
(1,'Alazán','alazan',0,TRUE,'criollos','coat'),
(1,'Negro','negro',0,TRUE,'genetics','coat'),
(1,'EMBRIONES','embriones',1,TRUE,'genetics','category'),
(1,'Colorado','colorado',1,TRUE,'genetics','coat'),
(1,'Yegua','yegua',1,TRUE,'criollos','category'),
(1,'Bayo','bayo',1,TRUE,'criollos','coat'),
(1,'Gateado','gateado',2,TRUE,'criollos','coat'),
(1,'SEMEN','semen',2,TRUE,'genetics','category'),
(1,'Potrillo','potrillo',2,TRUE,'criollos','category'),
(1,'Potranca','potranca',3,TRUE,'criollos','category'),
(1,'Lobuno','lobuno',3,TRUE,'criollos','coat'),
(1,'Caballo castrado','caballo-castrado',4,TRUE,'criollos','category'),
(1,'Moro','moro',4,TRUE,'criollos','coat'),
(1,'Overo','overo',5,TRUE,'criollos','coat'),
(1,'Rosillo','rosillo',6,TRUE,'criollos','coat'),
(1,'Tobiano','tobiano',7,TRUE,'criollos','coat'),
(1,'Zaino','zaino',8,TRUE,'criollos','coat')
ON CONFLICT (cabin_id,catalog_section,kind,slug) DO UPDATE SET name=EXCLUDED.name,sort_order=EXCLUDED.sort_order,active=EXCLUDED.active;

INSERT INTO public.gallery_categories (cabin_id,name,slug,sort_order,active) VALUES
(1,'Otros','otros',0,TRUE),
(1,'Trabajo de campo','trabajo-de-campo',1,TRUE),
(1,'Establecimiento','establecimiento',2,TRUE)
ON CONFLICT (cabin_id,slug) DO UPDATE SET name=EXCLUDED.name,sort_order=EXCLUDED.sort_order,active=EXCLUDED.active;

INSERT INTO public.animals (id,cabin_id,name,type,rp,breed,birth_date,coat,registration,description,genetics_provider_name,genetics_provider_url,catalog_section,intro_title,intro_emphasis,intro_secondary,pedigree_title,pedigree_emphasis,pedigree_description,status,featured,sold,image,birth_weight,weaning_weight,scrotal_circumference,frame,rp_label,birth_date_label,coat_label,registration_label,birth_weight_label,weaning_weight_label,scrotal_circumference_label,frame_label) VALUES
(12,1,'ORIENTAL 59-3317CS 2-3889','TOROS PI Y PC','4828','Aberdeen Angus','21/10/2024','Negro','HBU 238816',NULL,NULL,NULL,'genetics','Potencia, estructura','y corrección.','Su pedigree reúne líneas probadas de nuestro programa genético con referentes internacionales de la raza.','Pedigree de','tres generaciones.','Una genealogía sólida, construida sobre padres y madres que marcaron nuestro rodeo.','published',TRUE,FALSE,'/curupy/animal-4828-0.webp?home_x=34',NULL,'594 kg',NULL,'1','RP','Nacimiento','Pelaje','HBU','','Peso 19/8','','Lote'),
(23,1,'ORIENTAL 9-3955CS 2-6940','TOROS PI Y PC','7615','Aberdeen Angus','20/09/2024','Negro','75485',NULL,NULL,NULL,'genetics','Potencia, estructura','y corrección.','Su pedigree reúne líneas probadas de nuestro programa genético con referentes internacionales de la raza.','Pedigree de','tres generaciones.','Una genealogía sólida, construida sobre padres y madres que marcaron nuestro rodeo.','published',TRUE,FALSE,'/curupy/animal-7615-0.webp?home_x=43&home_y=48',NULL,'594',NULL,'2','RP','Nacimiento','Pelaje','HBU','Peso al nacer','Peso 19/8','Circ. escrotal','Lote'),
(25,1,'ORIENTAL 74-6909CS 6-6482','TOROS PI Y PC','7639','Aberdeen Angus','04/10/2024','Colorado','77464',NULL,NULL,NULL,'genetics','Potencia, estructura','y corrección.','Su pedigree reúne líneas probadas de nuestro programa genético con referentes internacionales de la raza.','Pedigree de','tres generaciones.','Una genealogía sólida, construida sobre padres y madres que marcaron nuestro rodeo.','published',FALSE,FALSE,'/curupy/animal-7639-0.webp',NULL,'578',NULL,'1','RP','Nacimiento','Pelaje','HBU','Peso al nacer','Peso 19/8','Circ. escrotal','Lote'),
(18,1,'ORIENTAL 44-6909CS 8-6240','TOROS PI Y PC','7554','Aberdeen Angus','30/08/2024','Negro','75427',NULL,NULL,NULL,'genetics','Potencia, estructura','y corrección.','Su pedigree reúne líneas probadas de nuestro programa genético con referentes internacionales de la raza.','Pedigree de','tres generaciones.','Una genealogía sólida, construida sobre padres y madres que marcaron nuestro rodeo.','published',FALSE,FALSE,'/curupy/animal-7554-0.webp',NULL,'656',NULL,'2','RP','Nacimiento','Pelaje','HBU','Peso al nacer','Peso 19/8','Circ. escrotal','Lote'),
(21,1,'ORIENTAL 19-DORADO 2-7013','TOROS PI Y PC','7578','Aberdeen Angus','06/09/2024','Negro','75450',NULL,NULL,NULL,'genetics','Potencia, estructura','y corrección.','Su pedigree reúne líneas probadas de nuestro programa genético con referentes internacionales de la raza.','Pedigree de','tres generaciones.','Una genealogía sólida, construida sobre padres y madres que marcaron nuestro rodeo.','published',FALSE,FALSE,'/curupy/animal-7578-0.webp',NULL,'566',NULL,'2','RP','Nacimiento','Pelaje','HBU','Peso al nacer','Peso 19/8','Circ. escrotal','Lote')
ON CONFLICT (id) DO UPDATE SET cabin_id=EXCLUDED.cabin_id,name=EXCLUDED.name,type=EXCLUDED.type,rp=EXCLUDED.rp,breed=EXCLUDED.breed,birth_date=EXCLUDED.birth_date,coat=EXCLUDED.coat,registration=EXCLUDED.registration,description=EXCLUDED.description,genetics_provider_name=EXCLUDED.genetics_provider_name,genetics_provider_url=EXCLUDED.genetics_provider_url,catalog_section=EXCLUDED.catalog_section,intro_title=EXCLUDED.intro_title,intro_emphasis=EXCLUDED.intro_emphasis,intro_secondary=EXCLUDED.intro_secondary,pedigree_title=EXCLUDED.pedigree_title,pedigree_emphasis=EXCLUDED.pedigree_emphasis,pedigree_description=EXCLUDED.pedigree_description,status=EXCLUDED.status,featured=EXCLUDED.featured,sold=EXCLUDED.sold,image=EXCLUDED.image,birth_weight=EXCLUDED.birth_weight,weaning_weight=EXCLUDED.weaning_weight,scrotal_circumference=EXCLUDED.scrotal_circumference,frame=EXCLUDED.frame,rp_label=EXCLUDED.rp_label,birth_date_label=EXCLUDED.birth_date_label,coat_label=EXCLUDED.coat_label,registration_label=EXCLUDED.registration_label,birth_weight_label=EXCLUDED.birth_weight_label,weaning_weight_label=EXCLUDED.weaning_weight_label,scrotal_circumference_label=EXCLUDED.scrotal_circumference_label,frame_label=EXCLUDED.frame_label,updated_at=NOW();

SELECT setval(pg_get_serial_sequence('public.animals','id'),(SELECT MAX(id) FROM public.animals),true);

INSERT INTO public.pedigree_members (animal_id,relation,name,registration,sort_order) VALUES
(12,'sire','ORIENTAL- 13 CHARRUA- 1 2768',NULL,0),
(12,'dam','RP 3889',NULL,1),
(12,'maternal_grandsire','S A V RAINFALL 6846',NULL,2),
(23,'sire','ORIENTAL - 23 - BRAVO - 4 - 2536. TE',NULL,0),
(23,'dam','RP 6940',NULL,1),
(23,'maternal_grandsire','COLEMAN CHARLO 0256',NULL,2),
(25,'sire','ORIENTAL - 11 - LADRON - 1 - 6609.',NULL,0),
(25,'dam','RP 6482',NULL,1),
(25,'maternal_grandsire','MAC´ACHIN QUEBRANTADOR 5010',NULL,2),
(18,'sire','ORIENTAL - 11 - LADRON - 1 - 6609.',NULL,0),
(18,'dam','RP 6240',NULL,1),
(18,'maternal_grandsire','ORIENTAL 2-COLEMAN REGGIS-1-2115',NULL,2),
(21,'sire','MUSHRUSH DORADO',NULL,0),
(21,'dam','RP 7013',NULL,1),
(21,'maternal_grandsire','ORIENTAL 6-2272 CS 1-2411',NULL,2)
ON CONFLICT (animal_id,relation) DO UPDATE SET name=EXCLUDED.name,registration=EXCLUDED.registration,sort_order=EXCLUDED.sort_order;

DELETE FROM public.genetic_data WHERE animal_id IN (12,23,25,18,21);

INSERT INTO public.genetic_data (animal_id,label,value,precision,percentile,sort_order) VALUES
(12,'PN','0.1','0.33','Top 20%',0),
(12,'PD','14.9','0.31',NULL,1),
(12,'HL','-2.1','0.27',NULL,2),
(12,'P18','15.3','0.39',NULL,3),
(12,'PA','9.3','0.21',NULL,4),
(12,'CE','0.6',NULL,NULL,5),
(12,'AOB','0.88','0.26',NULL,6),
(12,'Grasa','0.037','0.19',NULL,7),
(12,'MAR','0.049','0.22','Top 20%',8),
(23,'PN','-0.1','0.35','Top 20%',0),
(23,'PD','19.7','0.33','Top 20%',1),
(23,'HL','-6.2','0.31',NULL,2),
(23,'P18','16.6','0.41',NULL,3),
(23,'PA','13.9','0.24',NULL,4),
(23,'CE','0.8','0.37','Top 20%',5),
(23,'AOB','1.867','0.29','Top 20%',6),
(23,'Grasa','0.023','0.21',NULL,7),
(23,'MAR','0.015','0.25',NULL,8),
(25,'PN','0.3','0.34',NULL,0),
(25,'PD','13.8','0.3',NULL,1),
(25,'HL','-0.5','0.29',NULL,2),
(25,'P18','21.5','0.4',NULL,3),
(25,'PA','17.3','0.23',NULL,4),
(25,'CE','0',NULL,NULL,5),
(25,'AOB','1.764','0.28','Top 20%',6),
(25,'Grasa','0.022','0.2',NULL,7),
(25,'MAR','-0.011','0.24',NULL,8),
(18,'PN','0.7','0.34',NULL,0),
(18,'PD','21.4','0.31','Top 20%',1),
(18,'HL','2.7','0.3',NULL,2),
(18,'P18','38.7','0.4','Top 5%',3),
(18,'PA','32.8','0.21',NULL,4),
(18,'CE','0.3',NULL,NULL,5),
(18,'AOB','2.195','0.28','Top 20%',6),
(18,'Grasa','0.097','0.2','Top 20%',7),
(18,'MAR','0.034','0.24',NULL,8),
(21,'PN','0.1','0.36','Top 20%',0),
(21,'PD','14.3','0.34',NULL,1),
(21,'HL','-0.9','0.3',NULL,2),
(21,'P18','21.1','0.41',NULL,3),
(21,'PA','21.2','0.21',NULL,4),
(21,'CE','-0.2',NULL,NULL,5),
(21,'AOB','2.109','0.3','Top 20%',6),
(21,'Grasa','0.148','0.21','Top 5%',7),
(21,'MAR','0.053','0.24','Top 20%',8);

DELETE FROM public.animal_media WHERE animal_id IN (12,23,25,18,21);

INSERT INTO public.animal_media (animal_id,kind,storage_key,external_url,filename,content_type,caption,sort_order) VALUES
(12,'image',NULL,'/curupy/animal-4828-0.webp','20092026-946A6967-2.webp','image/webp',NULL,0),
(12,'video',NULL,'https://youtu.be/kdnzRxbmgfY',NULL,NULL,NULL,1),
(23,'image',NULL,'/curupy/animal-7615-0.webp','20092026-Captura de pantalla 2026-09-20 a la(s) 19.52.27.webp','image/webp',NULL,0),
(23,'video',NULL,'https://youtu.be/xsTMdl5GkLA',NULL,NULL,NULL,1),
(25,'image',NULL,'/curupy/animal-7639-0.webp','20092026-Captura de pantalla 2026-09-20 a la(s) 19.54.18.webp','image/webp',NULL,0),
(25,'video',NULL,'https://youtu.be/ZkRmFMdczlk',NULL,NULL,NULL,1),
(18,'image',NULL,'/curupy/animal-7554-0.webp','20092026-Captura de pantalla 2026-09-20 a la(s) 20.48.10.webp','image/webp',NULL,0),
(21,'image',NULL,'/curupy/animal-7578-0.webp','20092026-Captura de pantalla 2026-09-20 a la(s) 19.50.41.webp','image/webp',NULL,0),
(21,'video',NULL,'https://youtu.be/3l63t9yq76w',NULL,NULL,NULL,1);

INSERT INTO public.auctions (id,cabin_id,title,auction_date,auction_time,auctioneer,location,lots,description,catalog_url,stream_url,image,status,published,sort_order) VALUES
(1,1,'38° Remate Anual','2026-11-16','09:30',NULL,'Soriano, Uruguay','120 toros','Una nueva edición del remate anual de Curupy del Salvador, con genética seleccionada y toda la información del evento en un solo lugar.',NULL,NULL,'/curupy/site-auction-1.jpg','upcoming',TRUE,1)
ON CONFLICT (id) DO UPDATE SET cabin_id=EXCLUDED.cabin_id,title=EXCLUDED.title,auction_date=EXCLUDED.auction_date,auction_time=EXCLUDED.auction_time,auctioneer=EXCLUDED.auctioneer,location=EXCLUDED.location,lots=EXCLUDED.lots,description=EXCLUDED.description,catalog_url=EXCLUDED.catalog_url,stream_url=EXCLUDED.stream_url,image=EXCLUDED.image,status=EXCLUDED.status,published=EXCLUDED.published,sort_order=EXCLUDED.sort_order,updated_at=NOW();

SELECT setval(pg_get_serial_sequence('public.auctions','id'),(SELECT MAX(id) FROM public.auctions),true);

INSERT INTO public.news_posts (id,cabin_id,title,slug,excerpt,content,video_url,category,image,storage_key,article_image,article_storage_key,document_storage_key,document_filename,sort_order,published,published_at) VALUES
(1,1,'Video Institucional Curupy del Salvador','video-institucional-curupy-del-salvador-mtiwsjoq','Una presentación de la estancia, la producción y el enfoque de selección de Curupy del Salvador.','Más de 60 años de trabajo sostienen un programa de selección orientado a producir animales funcionales, adaptables y eficientes en condiciones reales de producción. En este video institucional compartimos el establecimiento, el rodeo y la filosofía que guía cada decisión.','https://youtu.be/SUlcJoCk26w','Actualidad','/curupy/news-1.jpg',NULL,NULL,NULL,NULL,NULL,0,TRUE,'2026-09-01T16:56:08.618Z'),
(2,1,'Embarque Novillos Julio 2026','embarque-novillos-julio-2026-mtj3w8xk','','','https://youtu.be/bRHu22v7mb8?si=oDoJOdBR6KzzeXAV','Actualidad','/curupy/news-2.jpg',NULL,NULL,NULL,NULL,NULL,1,TRUE,'2026-09-01T20:16:04.221Z'),
(10,1,'Embarque Mayo 2025','embarque-mayo-2025-mtjf0nz9','','','https://youtu.be/MyM3tNxnMV8','Actualidad','/curupy/news-10.jpg',NULL,NULL,NULL,NULL,NULL,2,TRUE,'2026-09-02T01:26:20.516Z'),
(9,1,'Ante la incertidumbre, capacidad de adaptación','ante-la-incertidumbre-capacidad-de-adaptacion-mtjemzem','','',NULL,'Actualidad','/curupy/news-9.jpg',NULL,NULL,NULL,'/curupy/document-9.pdf','aviso-curupy-junio2024.pdf',3,TRUE,'2026-09-02T01:15:42.142Z'),
(8,1,'Genética Angus de Curupy del Salvador: rumbo cierto y resultados seguros','genetica-angus-de-curupy-del-salvador-rumbo-cierto-y-resultados-seguros-mtjemg7s','','',NULL,'Actualidad','/curupy/news-8.jpg',NULL,NULL,NULL,'/curupy/document-8.pdf','anuario-angus-2024.pdf',4,TRUE,'2026-09-02T01:15:17.272Z'),
(7,1,'Al invertir en genética Angus, elija resultados consistentes','al-invertir-en-genetica-angus-elija-resultados-consistentes-mtjeluqf','','',NULL,'Actualidad','/curupy/news-7.jpg',NULL,NULL,NULL,'/curupy/document-7.pdf','aviso-curupy-julio2021.pdf',5,TRUE,'2026-09-02T01:14:49.431Z'),
(6,1,'En tiempos difíciles, nada vale más que un rumbo cierto','en-tiempos-dificiles-nada-vale-mas-que-un-rumbo-cierto-mtjel6ch','','',NULL,'Actualidad','/curupy/news-6.jpg',NULL,NULL,NULL,'/curupy/document-6.pdf','aviso-curupy-julio2023.pdf',6,TRUE,'2026-09-02T01:14:17.825Z'),
(5,1,'Resultados consistentes, ciclo tras ciclo','resultados-consistentes-ciclo-tras-ciclo-mtjekpmu','','',NULL,'Actualidad','/curupy/news-5.jpg',NULL,NULL,NULL,'/curupy/document-5.pdf','aviso-curupy-plan-agro-junio (1).pdf',7,TRUE,'2026-09-02T01:13:56.166Z'),
(4,1,'Presentación Ing. Agr. Lucas Gremminger, administrador de Curupy','presentacion-ing-agr-lucas-gremminger-administrador-de-curupy-mtjek406','','',NULL,'Actualidad','/curupy/news-4.jpg',NULL,NULL,NULL,'/curupy/document-4.pdf','presentacion-deps.pdf',8,TRUE,'2026-09-02T01:13:28.134Z'),
(3,1,'Precisión genética para producir ganados dúctiles','precision-genetica-para-producir-ganados-ductiles-mtjej3z8','','',NULL,'Actualidad','/curupy/news-3.jpg',NULL,NULL,NULL,'/curupy/document-3.pdf','aviso-curupy-setiembre2021 (1).pdf',9,TRUE,'2026-09-02T01:12:41.444Z')
ON CONFLICT (id) DO UPDATE SET cabin_id=EXCLUDED.cabin_id,title=EXCLUDED.title,slug=EXCLUDED.slug,excerpt=EXCLUDED.excerpt,content=EXCLUDED.content,video_url=EXCLUDED.video_url,category=EXCLUDED.category,image=EXCLUDED.image,storage_key=EXCLUDED.storage_key,article_image=EXCLUDED.article_image,article_storage_key=EXCLUDED.article_storage_key,document_storage_key=EXCLUDED.document_storage_key,document_filename=EXCLUDED.document_filename,sort_order=EXCLUDED.sort_order,published=EXCLUDED.published,published_at=EXCLUDED.published_at,updated_at=NOW();

SELECT setval(pg_get_serial_sequence('public.news_posts','id'),(SELECT MAX(id) FROM public.news_posts),true);

INSERT INTO public.gallery_media (id,cabin_id,storage_key,filename,content_type,caption,category,published,sort_order) VALUES
(1,1,'/curupy/gallery-1.jpg','946A2080.jpg','image/jpeg','Manejo del rodeo en el establecimiento.','Trabajo de campo',TRUE,0),
(2,1,'/curupy/gallery-2.jpg','946A2074.jpg','image/jpeg','Trabajo diario con el rodeo Angus.','Trabajo de campo',TRUE,1),
(3,1,'/curupy/gallery-3.jpg','946A2072.jpg','image/jpeg','Movimiento y organización del rodeo.','Trabajo de campo',TRUE,2),
(4,1,'/curupy/gallery-4.jpg','946A2043.jpg','image/jpeg','Producción ganadera en condiciones reales de campo.','Trabajo de campo',TRUE,3),
(5,1,'/curupy/gallery-5.jpg','946A1958.jpg','image/jpeg','Amanecer en el establecimiento.','Establecimiento',TRUE,4)
ON CONFLICT (id) DO UPDATE SET cabin_id=EXCLUDED.cabin_id,storage_key=EXCLUDED.storage_key,filename=EXCLUDED.filename,content_type=EXCLUDED.content_type,caption=EXCLUDED.caption,category=EXCLUDED.category,published=EXCLUDED.published,sort_order=EXCLUDED.sort_order;

SELECT setval(pg_get_serial_sequence('public.gallery_media','id'),(SELECT MAX(id) FROM public.gallery_media),true);

COMMIT;

SELECT 'site_content' AS tabla,COUNT(*) AS total FROM public.site_content WHERE cabin_id=1 UNION ALL SELECT 'site_images',COUNT(*) FROM public.site_images WHERE cabin_id=1 UNION ALL SELECT 'animals',COUNT(*) FROM public.animals WHERE cabin_id=1 UNION ALL SELECT 'news_posts',COUNT(*) FROM public.news_posts WHERE cabin_id=1 UNION ALL SELECT 'gallery_media',COUNT(*) FROM public.gallery_media WHERE cabin_id=1 UNION ALL SELECT 'auctions',COUNT(*) FROM public.auctions WHERE cabin_id=1;
