## Мотивация

Будучи увлечённым фотографией в жанре «городской пейзаж», зачастую приходится ожидать включения городской подсветки, либо знать точное время её отключения для планирования кадров. В городе, где я живу, информация о графике переключения городской подсветки общедоступна и публикуется ежегодно.

По сути, данные представляют собой небольшую таблицу. Остаётся лишь сверить дату и время. Не столь трудоёмкая задача, однако информация была необходима так часто, что решил упростить жизнь себе и коллегам, написав веб-приложение для работы с расписанием.

Со временем возникла идея дополнить приложение другой информацией, необходимой мне как фотографу и облегчающей планирование. К примеру, необходима информация о Солнце и Луне. Вместо того, чтобы агрегировать информацию, хотелось собирать необходимое в одном месте.

Любознательность заставляла не просто собрать информацию из различных источников и лишь отобразить её, а именно разобраться как и что работает изнутри, попробовать реализовать всё самостоятельно без использование сторонних решений и источников данных. Ключевой целью было обойтись без использования сети, сделать веб-приложение автономным, легковесным и производительным.

Много из этого удалось достичь во второй версии приложения.

## Интерфейс

Приложение разбито на секции, порядок и само наличие которых пользователь может настроить под себя.

### Городское освещение

Здесь отображена информация о переключении городской подсветки в выбранном городе с учётом заданных даты и времени.

Поддерживаются следующие города:

- г.Санкт-Петербург — [источник][lights-schedule-spb];
- г.Москва — [источник][lights-schedule-moscow];

В секции отображается:

- Город, для которого используются данные подсветки;
- Времена включения и отключения городской подсветки;
- Состояние городского освещения;
- Длительность городского освещения;
- Отсчёт времени до переключения городского освещения (для текущих суток);

Помимо этого времена включения и отключения городской подсветки отображаются в виде короткой временной шкалы вместе со временем восхода и захода Солнца, так как часто приходится ожидать появление подсветки до заката (или успеть застать до восхода).

### Солнце

В данной секции отображается вся необходимая информация касательно Солнца:

- Времена восхода а захода Солнца;
- Интервалы времени важных для фотосъёмки золотого и синего часов;
- Длительность Солнечного дня;
- Азимут, склонение и зенит Солнца;

Все типы сумерек, времена зенита и надира (темнейшего момента ночи) отображены на временной шкале.

### Луна

В данной секции отображается вся необходимая информация касательно Луны:

- Времена восхода а захода Луны;
- Зенит, высота, азимут и параллактический угол Луны;
- Длительность Лунного дня;
- Расстояние от Земли до Луны;
- Текущая фаза и процент освещенности Лунной поверхности;

Особенно полезной может быть диаграмма высоты Луны. Она отображает положение Луны относительно горизонта в течение суток. Здесь же отображается и высота Солнца для более удобного планирования, так как съёмка Луны не всегда возможна при определённом положении Солнца над горизонтом.

Для удобства представлена временная шкала восхода и захода Луны вместе с Солнцем.

### Разводные мосты г.Санкт-Петербурга

Данный раздел не включен по умолчанию, так как имеет мало смысла если пользователь находится не в Санкт-Петербурге.

Здесь отображается состояние разводных мостов г.Санкт-Петербург согласно постоянному расписанию.

**Важно**: иногда в расписание вносятся кратковременные коррективы в случае праздничных дней, ремонтных работ. Подобные изменения в приложении не учитываются.

Помимо того, даже будучи активной, вкладка может не появляться в меню навигации — она будет активна только во время **периода навигации**, когда мосты действительно разводятся. Это поведение тоже можно настроить, об этом чуточку позже.

В данном разделе отображаются:

- Расписание для всех разводных мостов в виде диаграмм;
- Текущее состояние разводных мостов;
- Отсчёт до ближайшей разводки или сведения моста;
- Отсчёт до ближайшего сведения или разводки среди всех мостов;
- Время до окончания или начала периода навигации;

### События

В этом разделе агрегируются различные события в единую временную шкалу. Единовременно отображаются события от выбранных даты-времени до конца следующих суток. Таким образом удобно видеть события, происходящие на стыке дней.

Те или иные события можно отключить полностью.

### Настройки

В этом разделе пользователю доступны параметры, благодаря которым он может настроить приложение под себя.

Пользовательские настройки хранятся локально на устройстве. При очистке кэша — они пропадут. В случае несовместимых будущих обновлений настройки могут быть стёрты для предотвращения ошибок несовместимости. В подобных случаях об этом будет упомянуто в логах изменений.

**Важно:** Для того, чтобы настройки вступили в силу, необходимо воспользоваться кнопкой "Сохранить".

### Геолокация

Данные геолокации необходимы для точности расчётов данных эфемерид (Луны и Солнца). Данные геопозиции можно ввести вручную, либо запросить с устройства. Данные, при этом, хранятся непосредственно на устройстве и не используются кроме как для расчётов эфемерид.

### Разделы приложения

Разделы приложения могут быть деактивированы (должны быть активными минимум 2 раздела) и их порядок может быть изменён.

**Важно**: раздел разводных мостов может всё равно не появиться в случае, если ещё на наступила навигация.

### Разводные мосты г.Санкт-Петербург

Здесь можно изменить поведение активации раздела, посвященного разводным мостам. По умолчанию вкладка появляется во время навигации. В случае необходимости вкладку можно активировать принудительно.

### Городское освещение

Здесь можно выбрать город, для которого доступно расписание городской подсветки.

### Фильтры событий

Здесь можно отфильтровать события либо точечно, либо целой группой.

**Важно**: события с разводными мостами доступны *только* во время навигации. Активировать их принудительно нельзя.

## Примечания

### Круговая диаграмма

В разделе **Освещение** и **Луна** для визуализации данных используется круговая диаграмма. Важно понимать, что она отображает данные о времени событий за конкретные сутки. Иногда, те или иные события охватывают несколько суток, например, Луна взошла сегодня и зайдёт за горизонт только завтра. В таких случаях на диаграмме появляется вертикальный разделитель, рассекающий шкалу; это даёт понять, что события уходят за пределы рассматриваемых суток.

### Расчёты эфемерид

Расчёты происходят полностью на устройстве и не требуют подключения к сети интернет. Важно понимать, что расчёты могут иметь определённый уровень погрешности для упрощения расчётов и меньшего потребления памяти, но достаточной для планирования.

[lights-schedule-spb]: https://lensvet.spb.ru/grafik_raboty_naruzhnogo_osvescheni/
[lights-schedule-moscow]: https://domdata.ru/osveschenie-v-moskve