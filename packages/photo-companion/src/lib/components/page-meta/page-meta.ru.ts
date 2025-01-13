import type { PageMetaDict } from "./page-meta.types";

export const PAGE_META: PageMetaDict = {
	"/": {
		DESCRIPTION: "Минималистичное веб-приложения для планирования фотосъёмок.",
		KEYWORDS: [ "фотография", "солнце", "луна", "городское освещение", "разводные мосты" ],
		TITLE: "Photo-Companion"
	},
	"/404": {
		DESCRIPTION: "Несуществующая страница",
		KEYWORDS: [ "404" ],
		TITLE: [ "404", "Photo-Companion" ]
	},
	"/about": {
		DESCRIPTION: "О приложении",
		KEYWORDS: [ "справка", "документация", "руководство по использованию" ],
		TITLE: [ "О приложении", "Photo-Companion" ]
	},
	"/bridges": {
		DESCRIPTION: "Разводные мосты г.Санкт-Петербурга",
		KEYWORDS: [ "мосты", "разводные мосты", "санкт-петербург", "расписание" ],
		TITLE: [ "Разводные мосты г.Санкт-Петербурга", "Photo-Companion" ]
	},
	"/lights": {
		DESCRIPTION: "Городское освещение",
		KEYWORDS: [ "городское освещение", "расписание" ],
		TITLE: [ "Городское освещение", "Photo-Companion" ]
	},
	"/moon": {
		DESCRIPTION: "Расчёты данных Луны",
		KEYWORDS: [ "луна", "фаза луны", "восход луны", "заход луны" ],
		TITLE: [ "Луна", "Photo-Companion" ]
	},
	"/now": {
		DESCRIPTION: "Сейчас",
		KEYWORDS: [ "панель управления", "луна", "солнце" ],
		TITLE: [ "Сейчас", "Photo-Companion" ]
	},
	"/settings": {
		DESCRIPTION: "Настройки",
		KEYWORDS: [ "настройки", "пользовательские предпочтения", "конфигурация" ],
		TITLE: [ "Настройки", "Photo-Companion" ]
	},
	"/sun": {
		DESCRIPTION: "Солнце",
		KEYWORDS: [ "солнце", "восход солнца", "закат солнца" ],
		TITLE: [ "Солнце", "Photo-Companion" ]
	},
	"/timeline": {
		DESCRIPTION: "События",
		KEYWORDS: [ "события", "временна шкала", "расписание" ],
		TITLE: [ "События", "Photo-Companion" ]
	}
};
