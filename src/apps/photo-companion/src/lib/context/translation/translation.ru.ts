import type { Translation } from "./translation.types";

export const t: Translation = {
	BRIDGE_NAME_SPB: {
		ALEXANDER_NEVSKY: "Александра Невского",
		ANNUNCIATION: "Благовещенский",
		BOLSHEOKHTINSKY: "Большеохтинский",
		EXCHANGE: "Биржевой",
		GRENADERSKY: "Гренадерский",
		KANTEMIROVSKY: "Кантемировский",
		LITEYNY: "Литейный",
		PALACE: "Дворцовый",
		SAMPSONIEVSKY: "Сампсониевский",
		TRINITY: "Троицкий",
		TUCHKOV: "Тучков",
		VOLODARSKY: "Володарский"
	},
	BRIDGE_SPB_EVENTS: {
		ALEXANDER_NEVSKY_CLOSE: "Сведение моста Александра Невского",
		ALEXANDER_NEVSKY_OPEN: "Развод моста Александра Невского",
		ANNUNCIATION_CLOSE: "Сведение Благовещенского моста",
		ANNUNCIATION_OPEN: "Развод Благовещенского моста",
		BOLSHEOKHTINSKY_CLOSE: "Сведение Большеохтинского моста",
		BOLSHEOKHTINSKY_OPEN: "Развод Большеохтинского моста",
		EXCHANGE_CLOSE: "Сведение Биржевого моста",
		EXCHANGE_OPEN: "Развод Биржевого моста",
		GRENADERSKY_CLOSE: "Сведение Гренадёрского моста",
		GRENADERSKY_OPEN: "Развод Гренадёрского моста",
		KANTEMIROVSKY_CLOSE: "Сведение Кантемировского моста",
		KANTEMIROVSKY_OPEN: "Развод Кантемировского моста",
		LITEYNY_CLOSE: "Сведение Литейного моста",
		LITEYNY_OPEN: "Развод Литейного моста",
		PALACE_CLOSE: "Сведение Дворцового моста",
		PALACE_OPEN: "Развод Дворцового моста",
		SAMPSONIEVSKY_CLOSE: "Сведение Сампсониевского моста",
		SAMPSONIEVSKY_OPEN: "Развод Сампсониевского моста",
		TRINITY_CLOSE: "Сведение Троицкого моста",
		TRINITY_OPEN: "Развод Троицкого моста",
		TUCHKOV_CLOSE: "Сведение Тучкова моста",
		TUCHKOV_OPEN: "Развод Тучкова моста",
		VOLODARSKY_CLOSE: "Сведение Володарского моста",
		VOLODARSKY_OPEN: "Развод Володарского моста"
	},
	CITIES: {
		MOSCOW: "г. Москва",
		SAINT_PETERSBURG: "г. Санкт-Петербург"
	},
	LABEL: {
		ALTITUDE: "Высота",
		ALWAYS: "Всегда",
		ASK_DEVICE_GEOLOCATION: "Запросить данные с устройства",
		AZIMUTH: "Азимут",
		BRIDGE: "мост",
		BRIDGE_CLOSED: "Сведён",
		BRIDGE_CLOSING: "Сведение моста",
		BRIDGE_OPENED: "Разведён",
		BRIDGE_OPENING: "Развод моста",
		BRIDGES_SPB: "Разводные мосты г.Санкт-Петербург",
		CITY: "Город",
		DATETIME: "Дата и время",
		DECLINATION: "Склонение",
		DISTANCE: "Расстояние",
		DURATION_DAYLIGHT: "Длительность солнечного дня",
		DURATION_LIGHTS: "Длительность освещения",
		DURATION_MOONLIGHT: "Длительность лунного дня",
		EVENT_ALLOW_LIST: "Фильтры событий",
		GEOLOCATION: "Геолокация",
		GO_HOME: "На главную",
		LANGUAGE: "Язык",
		LATITUDE: "Широта",
		LIGHTS_CITY: "Городское освещение",
		LONGITUDE: "Долгота",
		MENU: "Меню",
		MOON_ILLUMINATION: "Освещённость",
		MOON_PHASE: "Фаза",
		NAVIGATION_ONLY: "Во время навигации",
		NEXT_DAY: "Следующий день",
		NOW: "Сейчас",
		PARALLACTIC_ANGLE: "Параллактический угол",
		PREVIOUS_DAY: "Предыдущий день",
		RELOAD: "Перезапустить",
		RESET: "Сбросить",
		SAVE: "Сохранить",
		TABS: "Разделы приложения",
		TILL_TURNED_OFF: "До отключения",
		TILL_TURNED_ON: "До включения",
		TURNED_OFF: "Отключено",
		TURNED_ON: "Включено",
		WANING: "Убывающая",
		WAXING: "Растущая",
		ZENITH: "Зенит"
	},
	LIGHTS_EVENTS: {
		LIGHTS_END: "Выключение городского освещения",
		LIGHTS_START: "Включение городского освещения"
	},
	MESSAGE: {
		BRIDGE_EXCEPTION: "Разводка этого моста производится по предварительной заявке за 2 суток.",
		BRIDGE_WILL_CLOSE_WITHIN: "Мост будет сведён через",
		BRIDGE_WILL_OPEN_WITHIN: "Мост будет разведён через",
		CHECK_DATE_INPUT: "Проверьте поле ввода даты у нижнего края экрана, выберите верное значение",
		DATA_UPDATE_ERROR: "Не удалось получить данные",
		DATA_UPDATE_SUCCESS: "Данные обновлены",
		EVENTS_ARE_DISABLED: "Все типы событий отключены",
		NAVIGATION_IN: "До начала навигации",
		NAVIGATION_MODE: "Вкладка будет доступна в период, когда мосты действительно разводятся.",
		NO_EVENTS: "Никаких событий на сегодня",
		PAGE_404: "К сожалению, данная страница не существует...",
		SET_CURRENT_DATE_ADVICE: "Либо установите текущее значение даты и времени с помощью кнопки ниже",
		SET_CURRENT_DATETIME: "Установить текущие время и дату",
		TAB_LIMITS: "Выберите от 2 активных разделов",
		UPDATE: "Обновление готово к установке. Для установки, пожалуйста, перезагрузите приложение или страницу.",
		WRONG_DATE: "Выбрана неверная дата. Для решения проблемы",
		WRONG_DATE_URL: "Проверьте адресную строку, дата должна соответствовать формату"
	},
	MOON_PHASE: {
		FIRST_QUARTER: "Первая четверть",
		FULL_MOON: "Полнолуние",
		NEW_MOON: "Новолуние",
		THIRD_QUARTER: "Третья четверть",
		WANING_CRESCENT: "Убывающий месяц",
		WANING_GIBBOUS: "Убывающая Луна",
		WAXING_CRESCENT: "Растущий месяц",
		WAXING_GIBBOUS: "Растущая Луна"
	},
	MOON_TIMES: {
		MOONRISE: "Восход Луны",
		MOONSET: "Заход Луны"
	},
	SUN_TIMES: {
		ASTRONOMICAL_DAWN: "Астрономические сумерки",
		ASTRONOMICAL_DAWN_TITLE: "Ночь подходит к концу",
		ASTRONOMICAL_DUSK: "Начало ночи",
		ASTRONOMICAL_DUSK_TITLE: "Астрономические сумерки подходят к концу",
		BLUE_HOUR: "Синий час",
		BLUE_HOUR_END_DAWN: "Утренний синий час",
		BLUE_HOUR_END_DAWN_TITLE: "Утренний синий час подходит к концу",
		BLUE_HOUR_END_DUSK: "Вечерний синий час подходит к концу",
		BLUE_HOUR_START_DAWN: "Утренний синий час",
		BLUE_HOUR_START_DUSK: "Вечерний синий час",
		BLUE_HOUR_START_DUSK_TITLE: "Золотой час подходит к концу",
		CIVIL_DAWN: "Гражданские сумерки",
		CIVIL_DAWN_TITLE: "Навигационные сумерки подходят к концу",
		CIVIL_DUSK: "Гражданские сумерки",
		CIVIL_DUSK_TITLE: "Гражданские сумерки подходят к концу",
		GOLDEN_HOUR: "Золотой час",
		GOLDEN_HOUR_END_DAWN: "Утренний золотой час подходит к концу",
		GOLDEN_HOUR_END_DAWN_TITLE: "Начало солнечного дня",
		GOLDEN_HOUR_END_DUSK: "Гражданские сумерки",
		GOLDEN_HOUR_START_DAWN: "Утренний золотой час",
		GOLDEN_HOUR_START_DAWN_TITLE: "Гражданские сумерки подходят к концу",
		GOLDEN_HOUR_START_DUSK: "Вечерний золотой час",
		GOLDEN_HOUR_START_DUSK_TITLE: "Солнечный день подходит к концу",
		NADIR: "Солнце в надире",
		NADIR_TITLE: "Темнейший момент ночи",
		NAUTICAL_DAWN: "Навигационные сумерки",
		NAUTICAL_DAWN_TITLE: "Астрономические сумерки подходят к концу",
		NAUTICAL_DUSK: "Астрономические сумерки",
		NAUTICAL_DUSK_TITLE: "Навигационные сумерки подходят к концу",
		NIGHT: "Ночь",
		SOLAR_NOON: "Солнце в зените",
		SUNRISE_END: "Рассвет подходит к концу",
		SUNRISE_END_TITLE: "Солнечный диск вышел за горизонт",
		SUNRISE_START: "Рассвет Солнца",
		SUNRISE_START_TITLE: "Солнечный диск появляется у горизонта",
		SUNSET_END: "Закат Солнца подходит к концу",
		SUNSET_END_TITLE: "Солнечный диск ушёл за горизонт",
		SUNSET_START: "Закат Солнца",
		SUNSET_START_TITLE: "Солнечный диск касается горизонта"
	},
	TITLE: {
		ABOUT: "Справка",
		BRIDGES: "Мосты",
		BRIDGES_SCHEDULE_SPB: "Расписание разведения мостов г. Санкт-Петербург",
		CHANGELOG: "История изменений",
		ELEVATION_MOON: "Высота Луны",
		ELEVATION_SUN: "Высота Солнца",
		ERROR: "Произошла ошибка",
		LIGHTS: "Освещение",
		LIGHTS_DATA_BY_DATE: "Данные об освещении по датам",
		MOON: "Луна",
		MOON_PHASE_CALENDAR: "Календарь Лунных фаз",
		MOON_TIMES: "Времена восхода и захода Луны",
		NAVIGATION_CLOSED: "Навигация закрыта",
		NAVIGATION_OPENED: "Навигация открыта",
		SETTINGS: "Настройки",
		SUN: "Солнце",
		SUN_TIMES: "Времена восхода и захода Солнца",
		THE_CLOSEST_EVENT: "Ближайшее событие",
		TIMELINE: "События",
		UPDATE: "Обновление"
	}
};
