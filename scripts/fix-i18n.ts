import * as fs from 'node:fs';
import * as path from 'node:path';

const messagesDir = path.resolve('messages');
const enPath = path.join(messagesDir, 'en.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf-8'));

// Also read en to get proper values for translation
type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
interface JsonObject { [key: string]: JsonValue }

function isObject(v: JsonValue): v is JsonObject {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function isString(v: JsonValue): v is string {
  return typeof v === 'string';
}

// Locale-specific translations for the nested sections
// These are manual translations since we can't auto-translate
const translations: Record<string, Record<string, JsonValue>> = {
  fa: {
    common: {
      error: {
        unauthorized: 'دسترسی غیرمجاز',
        forbidden: 'ممنوع',
        notFound: 'پیدا نشد',
        failed: 'ناموفق',
        internalServerError: 'خطای داخلی سرور',
        notAuthenticated: 'احراز هویت نشده',
      },
      validation: {
        idRequired: 'شناسه الزامی است',
        contentRequired: 'محتوا الزامی است',
      },
    },
    chess: {
      undo: 'برگشت',
      reset: 'بازنشانی',
      engineAnalysis: 'تحلیل موتور',
      evaluate: 'ارزیابی',
      topLines: 'برترین خطوط',
      score: 'امتیاز',
      depth: 'عمق',
      best: 'بهترین',
      notAvailable: 'N/A',
      principalVariation: 'PV',
      engineError: 'خطای موتور',
      aiCoach: 'مربی هوش مصنوعی',
      analyzing: 'در حال تحلیل...',
      explainPosition: 'توضیح موقعیت',
      aiCoachUnavailable: 'مربی هوش مصنوعی در دسترس نیست. کلید API اضافه کنید.',
      engine: {
        initFailed: 'راه‌اندازی موتور ناموفق بود',
        evalTimedOut: 'زمان ارزیابی موتور به پایان رسید',
        notInitialized: 'موتور راه‌اندازی نشده',
      },
      validation: {
        pgnRequired: 'PGN الزامی است',
        invalidPgn: 'PGN نامعتبر',
        noMoves: 'حرکتی در PGN نیست',
        usernameRequired: 'نام کاربری الزامی است',
      },
      error: {
        analysisFailed: 'تحلیل ناموفق بود',
        importFailed: 'وارد کردن بازی‌ها ناموفق بود',
        lichessUserNotFound: 'کاربر Lichess پیدا نشد',
        ratingHistoryNotFound: 'تاریخچه رتبه‌بندی پیدا نشد',
        lichessGamesNotFound: 'بازی‌ها در Lichess پیدا نشد',
        dailyPuzzleFailed: 'دریافت معمای روز ناموفق بود',
        openingExplorerFailed: 'دریافت کاوشگر گشایش ناموفق بود',
        chesscomProfileNotFound: 'پروفایل Chess.com پیدا نشد',
        chesscomStatsNotFound: 'آمار Chess.com پیدا نشد',
        chesscomGamesNotFound: 'بازی‌ها در Chess.com پیدا نشد',
      },
    },
    achievements: {
      title: {
        firstPuzzle: 'اولین معمای حل شده',
        tenPuzzles: 'شاگرد معماها',
        hundredPuzzles: 'استاد معماها',
        firstLesson: 'اولین قدم‌ها',
        firstCourse: 'فارغ‌التحصیل دوره',
        streak7: 'جنگجوی هفته',
        streak30: 'استاد ماه',
        firstPost: 'آغازگر اجتماعی',
        firstComment: 'اهل گفتگو',
      },
      desc: {
        firstPuzzle: 'اولین معمای خود را حل کردید',
        tenPuzzles: '۱۰ معما حل کردید',
        hundredPuzzles: '۱۰۰ معما حل کردید',
        firstLesson: 'اولین درس خود را کامل کردید',
        firstCourse: 'اولین دوره خود را کامل کردید',
        streak7: '۷ روز متوالی',
        streak30: '۳۰ روز متوالی',
        firstPost: 'اولین پست خود را ایجاد کردید',
        firstComment: 'اولین نظر خود را نوشتید',
      },
    },
    levels: {
      bronze: 'برنز',
      silver: 'نقره',
      gold: 'طلا',
      platinum: 'پلاتین',
      diamond: 'الماس',
      master: 'استاد',
      grandmaster: 'استاد بزرگ',
    },
    plans: {
      standard: 'استاندارد',
      premium: 'پریمیوم',
      vip: 'VIP',
    },
    notifications: {
      likedYourPost: '{name} پست شما را لایک کرد',
      commentedOnYourPost: '{name} روی پست شما نظر داد',
      followedYou: '{name} شما را دنبال کرد',
    },
    theme: {
      toggleTheme: 'تغییر پوسته',
    },
    leaderboard: {
      error: {
        fetchFailed: 'دریافت جدول امتیازات ناموفق بود',
      },
    },
    progress: {
      validation: {
        lessonIdRequired: 'شناسه درس الزامی است',
      },
    },
    lessons: {
      error: {
        notFound: 'درس پیدا نشد',
      },
      validation: {
        queryRequired: 'شناسه یا شناسه ماژول یا شناسه دوره الزامی است',
      },
    },
    comments: {
      error: {
        fetchFailed: 'دریافت نظرات ناموفق بود',
        addFailed: 'افزودن نظر ناموفق بود',
      },
    },
    users: {
      error: {
        cannotFollowSelf: 'نمی‌توانید خودتان را دنبال کنید',
        toggleFollowFailed: 'تغییر وضعیت دنبال کردن ناموفق بود',
      },
    },
    upload: {
      error: {
        noFile: 'فایلی ارائه نشده',
        failed: 'بارگذاری فایل ناموفق بود',
      },
    },
    payments: {
      error: {
        invalidPlan: 'طرح نامعتبر',
        checkoutFailed: 'ایجاد پرداخت ناموفق بود',
        noCustomer: 'مشتری Stripe پیدا نشد',
        portalFailed: 'ایجاد پورتال ناموفق بود',
        webhookError: 'خطای وب‌هوک',
      },
    },
    xp: {
      error: {
        invalidAction: 'عملیات نامعتبر',
      },
    },
    ai: {
      error: {
        fenRequired: 'FEN الزامی است',
        unavailable: 'هوش مصنوعی در دسترس نیست',
        allProvidersFailed: 'همه ارائه‌دهندگان هوش مصنوعی ناموفق بودند',
      },
    },
    cron: {
      error: {
        fetchPuzzleFromLichess: 'دریافت معما از Lichess ناموفق بود',
      },
    },
    posts: {
      error: {
        fetchFailed: 'دریافت پست‌ها ناموفق بود',
        createFailed: 'ایجاد پست ناموفق بود',
        updateFailed: 'به‌روزرسانی پست ناموفق بود',
        deleteFailed: 'حذف پست ناموفق بود',
        toggleLikeFailed: 'تغییر وضعیت لایک ناموفق بود',
      },
      validation: {
        idAndContentRequired: 'شناسه و محتوا الزامی است',
      },
    },
    quizzes: {
      error: {
        notFound: 'آزمون پیدا نشد',
        maxAttempts: 'حداکثر تلاش‌ها',
        attemptNotFound: 'تلاش پیدا نشد',
        alreadySubmitted: 'قبلاً ارسال شده',
      },
    },
    // Fix nested objects within existing sections
    adminValidation: {
      courseIdRequired: 'شناسه دوره الزامی است',
      titleAndCourseIdRequired: 'عنوان و شناسه دوره الزامی است',
      idAndTitleRequired: 'شناسه و عنوان الزامی است',
      moduleIdRequired: 'شناسه ماژول الزامی است',
      titleModuleIdCourseIdRequired: 'عنوان، شناسه ماژول و شناسه دوره الزامی است',
      titleRequired: 'عنوان الزامی است',
      idAndContentRequired: 'شناسه و محتوا الزامی است',
    },
    authValidation: {
      nameTooShort: 'نام خیلی کوتاه است',
      invalidEmail: 'ایمیل معتبر وارد کنید',
      passwordTooShort: 'رمز عبور باید حداقل ۸ کاراکتر باشد',
      emailExists: 'این ایمیل قبلاً ثبت شده است',
    },
    contactValidation: {
      fieldsRequired: 'نام، ایمیل و پیام الزامی است',
    },
    contactSuccess: {
      messageReceived: 'پیام دریافت شد. به زودی با شما تماس خواهیم گرفت.',
    },
    footerSocial: {
      youtube: 'یوتیوب',
      instagram: 'اینستاگرام',
      discord: 'دیسکورد',
      telegram: 'تلگرام',
    },
    groupsValidation: {
      nameRequired: 'نام الزامی است',
    },
    tournamentsValidation: {
      nameRequired: 'نام الزامی است',
    },
    tournamentsError: {
      full: 'مسابقه پر است',
    },
    puzzlesValidation: {
      fieldsRequired: 'شناسه معما و حل شده الزامی است',
    },
    puzzlesError: {
      notFound: 'معما پیدا نشد',
      noneAvailable: 'معمایی موجود نیست',
      recordFailed: 'ثبت تلاش ناموفق بود',
    },
    coursesError: {
      notFound: 'دوره پیدا نشد',
    },
  },
  ru: {
    common: {
      error: {
        unauthorized: 'Нет доступа',
        forbidden: 'Запрещено',
        notFound: 'Не найдено',
        failed: 'Ошибка',
        internalServerError: 'Внутренняя ошибка сервера',
        notAuthenticated: 'Не авторизован',
      },
      validation: {
        idRequired: 'Требуется ID',
        contentRequired: 'Требуется контент',
      },
    },
    chess: {
      undo: 'Отменить',
      reset: 'Сброс',
      engineAnalysis: 'Анализ движка',
      evaluate: 'Оценить',
      topLines: 'Лучшие линии',
      score: 'Оценка',
      depth: 'Глубина',
      best: 'Лучший',
      notAvailable: 'Н/Д',
      principalVariation: 'ГВ',
      engineError: 'Ошибка движка',
      aiCoach: 'ИИ-тренер',
      analyzing: 'Анализ...',
      explainPosition: 'Объяснить позицию',
      aiCoachUnavailable: 'ИИ-тренер недоступен. Добавьте API-ключ.',
      engine: {
        initFailed: 'Не удалось инициализировать движок',
        evalTimedOut: 'Время оценки движка истекло',
        notInitialized: 'Движок не инициализирован',
      },
      validation: {
        pgnRequired: 'Требуется PGN',
        invalidPgn: 'Неверный PGN',
        noMoves: 'Нет ходов в PGN',
        usernameRequired: 'Требуется имя пользователя',
      },
      error: {
        analysisFailed: 'Анализ не удался',
        importFailed: 'Не удалось импортировать партии',
        lichessUserNotFound: 'Пользователь Lichess не найден',
        ratingHistoryNotFound: 'История рейтинга не найдена',
        lichessGamesNotFound: 'Партии на Lichess не найдены',
        dailyPuzzleFailed: 'Не удалось загрузить ежедневную задачу',
        openingExplorerFailed: 'Не удалось загрузить дебютную базу',
        chesscomProfileNotFound: 'Профиль Chess.com не найден',
        chesscomStatsNotFound: 'Статистика Chess.com не найдена',
        chesscomGamesNotFound: 'Партии на Chess.com не найдены',
      },
    },
    achievements: {
      title: {
        firstPuzzle: 'Первая решённая задача',
        tenPuzzles: 'Ученик задач',
        hundredPuzzles: 'Мастер задач',
        firstLesson: 'Первые шаги',
        firstCourse: 'Выпускник курса',
        streak7: 'Воин недели',
        streak30: 'Мастер месяца',
        firstPost: 'Социальный старт',
        firstComment: 'Собеседник',
      },
      desc: {
        firstPuzzle: 'Решили свою первую задачу',
        tenPuzzles: 'Решили 10 задач',
        hundredPuzzles: 'Решили 100 задач',
        firstLesson: 'Завершили первый урок',
        firstCourse: 'Завершили первый курс',
        streak7: 'Серия из 7 дней',
        streak30: 'Серия из 30 дней',
        firstPost: 'Создали первый пост',
        firstComment: 'Написали первый комментарий',
      },
    },
    levels: {
      bronze: 'Бронза',
      silver: 'Серебро',
      gold: 'Золото',
      platinum: 'Платина',
      diamond: 'Алмаз',
      master: 'Мастер',
      grandmaster: 'Гроссмейстер',
    },
    plans: {
      standard: 'Стандарт',
      premium: 'Премиум',
      vip: 'VIP',
    },
    notifications: {
      likedYourPost: '{name} понравился ваш пост',
      commentedOnYourPost: '{name} прокомментировал ваш пост',
      followedYou: '{name} подписался на вас',
    },
    theme: {
      toggleTheme: 'Переключить тему',
    },
    leaderboard: {
      error: {
        fetchFailed: 'Не удалось загрузить таблицу лидеров',
      },
    },
    progress: {
      validation: {
        lessonIdRequired: 'Требуется lessonId',
      },
    },
    lessons: {
      error: {
        notFound: 'Урок не найден',
      },
      validation: {
        queryRequired: 'Требуется id, moduleId или courseId',
      },
    },
    comments: {
      error: {
        fetchFailed: 'Не удалось загрузить комментарии',
        addFailed: 'Не удалось добавить комментарий',
      },
    },
    users: {
      error: {
        cannotFollowSelf: 'Нельзя подписаться на себя',
        toggleFollowFailed: 'Не удалось изменить подписку',
      },
    },
    upload: {
      error: {
        noFile: 'Файл не предоставлен',
        failed: 'Не удалось загрузить файл',
      },
    },
    payments: {
      error: {
        invalidPlan: 'Неверный план',
        checkoutFailed: 'Не удалось создать оплату',
        noCustomer: 'Клиент Stripe не найден',
        portalFailed: 'Не удалось создать портал',
        webhookError: 'Ошибка вебхука',
      },
    },
    xp: {
      error: {
        invalidAction: 'Неверное действие',
      },
    },
    ai: {
      error: {
        fenRequired: 'Требуется FEN',
        unavailable: 'ИИ недоступен',
        allProvidersFailed: 'Все ИИ-провайдеры недоступны',
      },
    },
    cron: {
      error: {
        fetchPuzzleFromLichess: 'Не удалось загрузить задачу из Lichess',
      },
    },
    posts: {
      error: {
        fetchFailed: 'Не удалось загрузить посты',
        createFailed: 'Не удалось создать пост',
        updateFailed: 'Не удалось обновить пост',
        deleteFailed: 'Не удалось удалить пост',
        toggleLikeFailed: 'Не удалось изменить лайк',
      },
      validation: {
        idAndContentRequired: 'Требуется ID и контент',
      },
    },
    quizzes: {
      error: {
        notFound: 'Тест не найден',
        maxAttempts: 'Достигнут лимит попыток',
        attemptNotFound: 'Попытка не найдена',
        alreadySubmitted: 'Уже отправлено',
      },
    },
    adminValidation: {
      courseIdRequired: 'Требуется courseId',
      titleAndCourseIdRequired: 'Требуется title и courseId',
      idAndTitleRequired: 'Требуется ID и title',
      moduleIdRequired: 'Требуется moduleId',
      titleModuleIdCourseIdRequired: 'Требуется title, moduleId и courseId',
      titleRequired: 'Требуется title',
      idAndContentRequired: 'Требуется ID и content',
    },
    authValidation: {
      nameTooShort: 'Имя слишком короткое',
      invalidEmail: 'Введите действительный email',
      passwordTooShort: 'Пароль должен быть не менее 8 символов',
      emailExists: 'Аккаунт с таким email уже существует',
    },
    contactValidation: {
      fieldsRequired: 'Имя, email и сообщение обязательны',
    },
    contactSuccess: {
      messageReceived: 'Сообщение получено. Мы свяжемся с вами в ближайшее время.',
    },
    footerSocial: {
      youtube: 'YouTube',
      instagram: 'Instagram',
      discord: 'Discord',
      telegram: 'Telegram',
    },
    groupsValidation: {
      nameRequired: 'Требуется название',
    },
    tournamentsValidation: {
      nameRequired: 'Требуется название',
    },
    tournamentsError: {
      full: 'Турнир заполнен',
    },
    puzzlesValidation: {
      fieldsRequired: 'Требуется puzzleId и solved',
    },
    puzzlesError: {
      notFound: 'Задача не найдена',
      noneAvailable: 'Нет доступных задач',
      recordFailed: 'Не удалось записать попытку',
    },
    coursesError: {
      notFound: 'Курс не найден',
    },
  },
  it: {
    common: {
      error: {
        unauthorized: 'Non autorizzato',
        forbidden: 'Vietato',
        notFound: 'Non trovato',
        failed: 'Fallito',
        internalServerError: 'Errore interno del server',
        notAuthenticated: 'Non autenticato',
      },
      validation: {
        idRequired: 'ID richiesto',
        contentRequired: 'Contenuto richiesto',
      },
    },
    chess: {
      undo: 'Annulla',
      reset: 'Ripristina',
      engineAnalysis: 'Analisi del motore',
      evaluate: 'Valuta',
      topLines: 'Linee principali',
      score: 'Punteggio',
      depth: 'Profondità',
      best: 'Migliore',
      notAvailable: 'N/D',
      principalVariation: 'VP',
      engineError: 'Errore del motore',
      aiCoach: 'Coach IA',
      analyzing: 'Analisi in corso...',
      explainPosition: 'Spiega posizione',
      aiCoachUnavailable: 'Coach IA non disponibile. Aggiungi una chiave API.',
      engine: {
        initFailed: 'Inizializzazione del motore fallita',
        evalTimedOut: 'Valutazione del motore scaduta',
        notInitialized: 'Motore non inizializzato',
      },
      validation: {
        pgnRequired: 'PGN richiesto',
        invalidPgn: 'PGN non valido',
        noMoves: 'Nessuna mossa nel PGN',
        usernameRequired: 'Nome utente richiesto',
      },
      error: {
        analysisFailed: 'Analisi fallita',
        importFailed: 'Importazione partite fallita',
        lichessUserNotFound: 'Utente Lichess non trovato',
        ratingHistoryNotFound: 'Storico rating non trovato',
        lichessGamesNotFound: 'Partite non trovate su Lichess',
        dailyPuzzleFailed: 'Recupero puzzle giornaliero fallito',
        openingExplorerFailed: 'Recupero esploratore aperture fallito',
        chesscomProfileNotFound: 'Profilo Chess.com non trovato',
        chesscomStatsNotFound: 'Statistiche Chess.com non trovate',
        chesscomGamesNotFound: 'Partite non trovate su Chess.com',
      },
    },
    achievements: {
      title: {
        firstPuzzle: 'Primo puzzle risolto',
        tenPuzzles: 'Apprendista puzzle',
        hundredPuzzles: 'Maestro puzzle',
        firstLesson: 'Primi passi',
        firstCourse: 'Diplomato',
        streak7: 'Guerriero settimanale',
        streak30: 'Maestro mensile',
        firstPost: 'Inizio sociale',
        firstComment: 'Conversatore',
      },
      desc: {
        firstPuzzle: 'Hai risolto il tuo primo puzzle',
        tenPuzzles: 'Hai risolto 10 puzzle',
        hundredPuzzles: 'Hai risolto 100 puzzle',
        firstLesson: 'Hai completato la tua prima lezione',
        firstCourse: 'Hai completato il tuo primo corso',
        streak7: 'Serie di 7 giorni',
        streak30: 'Serie di 30 giorni',
        firstPost: 'Hai creato il tuo primo post',
        firstComment: 'Hai scritto il tuo primo commento',
      },
    },
    levels: {
      bronze: 'Bronzo',
      silver: 'Argento',
      gold: 'Oro',
      platinum: 'Platino',
      diamond: 'Diamante',
      master: 'Maestro',
      grandmaster: 'Grande Maestro',
    },
    plans: {
      standard: 'Standard',
      premium: 'Premium',
      vip: 'VIP',
    },
    notifications: {
      likedYourPost: 'A {name} piace il tuo post',
      commentedOnYourPost: '{name} ha commentato il tuo post',
      followedYou: '{name} ha iniziato a seguirti',
    },
    theme: {
      toggleTheme: 'Cambia tema',
    },
    leaderboard: {
      error: {
        fetchFailed: 'Recupero classifica fallito',
      },
    },
    progress: {
      validation: {
        lessonIdRequired: 'lessonId richiesto',
      },
    },
    lessons: {
      error: {
        notFound: 'Lezione non trovata',
      },
      validation: {
        queryRequired: 'id, moduleId o courseId richiesto',
      },
    },
    comments: {
      error: {
        fetchFailed: 'Recupero commenti fallito',
        addFailed: 'Aggiunta commento fallita',
      },
    },
    users: {
      error: {
        cannotFollowSelf: 'Non puoi seguire te stesso',
        toggleFollowFailed: 'Cambio follow fallito',
      },
    },
    upload: {
      error: {
        noFile: 'Nessun file fornito',
        failed: 'Caricamento file fallito',
      },
    },
    payments: {
      error: {
        invalidPlan: 'Piano non valido',
        checkoutFailed: 'Creazione pagamento fallita',
        noCustomer: 'Nessun cliente Stripe trovato',
        portalFailed: 'Creazione portale fallita',
        webhookError: 'Errore webhook',
      },
    },
    xp: {
      error: {
        invalidAction: 'Azione non valida',
      },
    },
    ai: {
      error: {
        fenRequired: 'FEN richiesto',
        unavailable: 'IA non disponibile',
        allProvidersFailed: 'Tutti i provider IA hanno fallito',
      },
    },
    cron: {
      error: {
        fetchPuzzleFromLichess: 'Recupero puzzle da Lichess fallito',
      },
    },
    posts: {
      error: {
        fetchFailed: 'Recupero post fallito',
        createFailed: 'Creazione post fallita',
        updateFailed: 'Aggiornamento post fallito',
        deleteFailed: 'Eliminazione post fallita',
        toggleLikeFailed: 'Cambio like fallito',
      },
      validation: {
        idAndContentRequired: 'ID e contenuto richiesti',
      },
    },
    quizzes: {
      error: {
        notFound: 'Quiz non trovato',
        maxAttempts: 'Limite tentativi raggiunto',
        attemptNotFound: 'Tentativo non trovato',
        alreadySubmitted: 'Già inviato',
      },
    },
    adminValidation: {
      courseIdRequired: 'courseId richiesto',
      titleAndCourseIdRequired: 'Titolo e courseId richiesti',
      idAndTitleRequired: 'ID e titolo richiesti',
      moduleIdRequired: 'moduleId richiesto',
      titleModuleIdCourseIdRequired: 'Titolo, moduleId e courseId richiesti',
      titleRequired: 'Titolo richiesto',
      idAndContentRequired: 'ID e contenuto richiesti',
    },
    authValidation: {
      nameTooShort: 'Nome troppo corto',
      invalidEmail: 'Inserisci un\'email valida',
      passwordTooShort: 'La password deve essere di almeno 8 caratteri',
      emailExists: 'Un account con questa email esiste già',
    },
    contactValidation: {
      fieldsRequired: 'Nome, email e messaggio sono obbligatori',
    },
    contactSuccess: {
      messageReceived: 'Messaggio ricevuto. Ti risponderemo presto.',
    },
    footerSocial: {
      youtube: 'YouTube',
      instagram: 'Instagram',
      discord: 'Discord',
      telegram: 'Telegram',
    },
    groupsValidation: {
      nameRequired: 'Nome richiesto',
    },
    tournamentsValidation: {
      nameRequired: 'Nome richiesto',
    },
    tournamentsError: {
      full: 'Torneo pieno',
    },
    puzzlesValidation: {
      fieldsRequired: 'puzzleId e solved richiesti',
    },
    puzzlesError: {
      notFound: 'Puzzle non trovato',
      noneAvailable: 'Nessun puzzle disponibile',
      recordFailed: 'Registrazione tentativo fallita',
    },
    coursesError: {
      notFound: 'Corso non trovato',
    },
  },
  de: {
    common: {
      error: {
        unauthorized: 'Nicht autorisiert',
        forbidden: 'Verboten',
        notFound: 'Nicht gefunden',
        failed: 'Fehlgeschlagen',
        internalServerError: 'Interner Serverfehler',
        notAuthenticated: 'Nicht authentifiziert',
      },
      validation: {
        idRequired: 'ID erforderlich',
        contentRequired: 'Inhalt erforderlich',
      },
    },
    chess: {
      undo: 'Rückgängig',
      reset: 'Zurücksetzen',
      engineAnalysis: 'Engine-Analyse',
      evaluate: 'Bewerten',
      topLines: 'Beste Züge',
      score: 'Bewertung',
      depth: 'Tiefe',
      best: 'Bester',
      notAvailable: 'N/V',
      principalVariation: 'HV',
      engineError: 'Engine-Fehler',
      aiCoach: 'KI-Trainer',
      analyzing: 'Analysiere...',
      explainPosition: 'Position erklären',
      aiCoachUnavailable: 'KI-Trainer nicht verfügbar. API-Schlüssel hinzufügen.',
      engine: {
        initFailed: 'Engine-Initialisierung fehlgeschlagen',
        evalTimedOut: 'Engine-Bewertung abgelaufen',
        notInitialized: 'Engine nicht initialisiert',
      },
      validation: {
        pgnRequired: 'PGN erforderlich',
        invalidPgn: 'Ungültiges PGN',
        noMoves: 'Keine Züge im PGN',
        usernameRequired: 'Benutzername erforderlich',
      },
      error: {
        analysisFailed: 'Analyse fehlgeschlagen',
        importFailed: 'Import fehlgeschlagen',
        lichessUserNotFound: 'Lichess-Benutzer nicht gefunden',
        ratingHistoryNotFound: 'Rating-Verlauf nicht gefunden',
        lichessGamesNotFound: 'Spiele auf Lichess nicht gefunden',
        dailyPuzzleFailed: 'Tägliches Puzzle konnte nicht geladen werden',
        openingExplorerFailed: 'Eröffnungs-Explorer konnte nicht geladen werden',
        chesscomProfileNotFound: 'Chess.com-Profil nicht gefunden',
        chesscomStatsNotFound: 'Chess.com-Statistiken nicht gefunden',
        chesscomGamesNotFound: 'Spiele auf Chess.com nicht gefunden',
      },
    },
    achievements: {
      title: {
        firstPuzzle: 'Erstes Puzzle gelöst',
        tenPuzzles: 'Puzzle-Lehrling',
        hundredPuzzles: 'Puzzle-Meister',
        firstLesson: 'Erste Schritte',
        firstCourse: 'Kurs-Absolvent',
        streak7: 'Wochen-Krieger',
        streak30: 'Monats-Meister',
        firstPost: 'Sozialer Start',
        firstComment: 'Gesprächig',
      },
      desc: {
        firstPuzzle: 'Dein erstes Puzzle gelöst',
        tenPuzzles: '10 Puzzles gelöst',
        hundredPuzzles: '100 Puzzles gelöst',
        firstLesson: 'Deine erste Lektion abgeschlossen',
        firstCourse: 'Deinen ersten Kurs abgeschlossen',
        streak7: '7-Tage-Serie',
        streak30: '30-Tage-Serie',
        firstPost: 'Deinen ersten Beitrag erstellt',
        firstComment: 'Deinen ersten Kommentar geschrieben',
      },
    },
    levels: {
      bronze: 'Bronze',
      silver: 'Silber',
      gold: 'Gold',
      platinum: 'Platin',
      diamond: 'Diamant',
      master: 'Meister',
      grandmaster: 'Großmeister',
    },
    plans: {
      standard: 'Standard',
      premium: 'Premium',
      vip: 'VIP',
    },
    notifications: {
      likedYourPost: '{name} gefällt dein Beitrag',
      commentedOnYourPost: '{name} hat deinen Beitrag kommentiert',
      followedYou: '{name} folgt dir jetzt',
    },
    theme: {
      toggleTheme: 'Design wechseln',
    },
    leaderboard: {
      error: {
        fetchFailed: 'Bestenliste konnte nicht geladen werden',
      },
    },
    progress: {
      validation: {
        lessonIdRequired: 'lessonId erforderlich',
      },
    },
    lessons: {
      error: {
        notFound: 'Lektion nicht gefunden',
      },
      validation: {
        queryRequired: 'id, moduleId oder courseId erforderlich',
      },
    },
    comments: {
      error: {
        fetchFailed: 'Kommentare konnten nicht geladen werden',
        addFailed: 'Kommentar konnte nicht hinzugefügt werden',
      },
    },
    users: {
      error: {
        cannotFollowSelf: 'Du kannst dir nicht selbst folgen',
        toggleFollowFailed: 'Folgen-Status konnte nicht geändert werden',
      },
    },
    upload: {
      error: {
        noFile: 'Keine Datei bereitgestellt',
        failed: 'Datei-Upload fehlgeschlagen',
      },
    },
    payments: {
      error: {
        invalidPlan: 'Ungültiger Plan',
        checkoutFailed: 'Checkout konnte nicht erstellt werden',
        noCustomer: 'Kein Stripe-Kunde gefunden',
        portalFailed: 'Portal konnte nicht erstellt werden',
        webhookError: 'Webhook-Fehler',
      },
    },
    xp: {
      error: {
        invalidAction: 'Ungültige Aktion',
      },
    },
    ai: {
      error: {
        fenRequired: 'FEN erforderlich',
        unavailable: 'KI nicht verfügbar',
        allProvidersFailed: 'Alle KI-Anbieter fehlgeschlagen',
      },
    },
    cron: {
      error: {
        fetchPuzzleFromLichess: 'Puzzle von Lichess konnte nicht geladen werden',
      },
    },
    posts: {
      error: {
        fetchFailed: 'Beiträge konnten nicht geladen werden',
        createFailed: 'Beitrag konnte nicht erstellt werden',
        updateFailed: 'Beitrag konnte nicht aktualisiert werden',
        deleteFailed: 'Beitrag konnte nicht gelöscht werden',
        toggleLikeFailed: 'Like-Status konnte nicht geändert werden',
      },
      validation: {
        idAndContentRequired: 'ID und Inhalt erforderlich',
      },
    },
    quizzes: {
      error: {
        notFound: 'Quiz nicht gefunden',
        maxAttempts: 'Maximale Versuche erreicht',
        attemptNotFound: 'Versuch nicht gefunden',
        alreadySubmitted: 'Bereits eingereicht',
      },
    },
    adminValidation: {
      courseIdRequired: 'courseId erforderlich',
      titleAndCourseIdRequired: 'Titel und courseId erforderlich',
      idAndTitleRequired: 'ID und Titel erforderlich',
      moduleIdRequired: 'moduleId erforderlich',
      titleModuleIdCourseIdRequired: 'Titel, moduleId und courseId erforderlich',
      titleRequired: 'Titel erforderlich',
      idAndContentRequired: 'ID und Inhalt erforderlich',
    },
    authValidation: {
      nameTooShort: 'Name zu kurz',
      invalidEmail: 'Gültige E-Mail eingeben',
      passwordTooShort: 'Passwort muss mindestens 8 Zeichen lang sein',
      emailExists: 'Ein Konto mit dieser E-Mail existiert bereits',
    },
    contactValidation: {
      fieldsRequired: 'Name, E-Mail und Nachricht sind erforderlich',
    },
    contactSuccess: {
      messageReceived: 'Nachricht erhalten. Wir werden uns bald bei Ihnen melden.',
    },
    footerSocial: {
      youtube: 'YouTube',
      instagram: 'Instagram',
      discord: 'Discord',
      telegram: 'Telegram',
    },
    groupsValidation: {
      nameRequired: 'Name erforderlich',
    },
    tournamentsValidation: {
      nameRequired: 'Name erforderlich',
    },
    tournamentsError: {
      full: 'Turnier voll',
    },
    puzzlesValidation: {
      fieldsRequired: 'puzzleId und solved erforderlich',
    },
    puzzlesError: {
      notFound: 'Puzzle nicht gefunden',
      noneAvailable: 'Keine Puzzles verfügbar',
      recordFailed: 'Versuch konnte nicht aufgezeichnet werden',
    },
    coursesError: {
      notFound: 'Kurs nicht gefunden',
    },
  },
  fr: {
    common: {
      error: {
        unauthorized: 'Non autorisé',
        forbidden: 'Interdit',
        notFound: 'Non trouvé',
        failed: 'Échoué',
        internalServerError: 'Erreur interne du serveur',
        notAuthenticated: 'Non authentifié',
      },
      validation: {
        idRequired: 'ID requis',
        contentRequired: 'Contenu requis',
      },
    },
    chess: {
      undo: 'Annuler',
      reset: 'Réinitialiser',
      engineAnalysis: 'Analyse du moteur',
      evaluate: 'Évaluer',
      topLines: 'Meilleures lignes',
      score: 'Score',
      depth: 'Profondeur',
      best: 'Meilleur',
      notAvailable: 'N/D',
      principalVariation: 'VP',
      engineError: 'Erreur du moteur',
      aiCoach: 'Coach IA',
      analyzing: 'Analyse en cours...',
      explainPosition: 'Expliquer la position',
      aiCoachUnavailable: 'Coach IA indisponible. Ajoutez une clé API.',
      engine: {
        initFailed: 'Échec d\'initialisation du moteur',
        evalTimedOut: 'Évaluation du moteur expirée',
        notInitialized: 'Moteur non initialisé',
      },
      validation: {
        pgnRequired: 'PGN requis',
        invalidPgn: 'PGN invalide',
        noMoves: 'Aucun coup dans le PGN',
        usernameRequired: 'Nom d\'utilisateur requis',
      },
      error: {
        analysisFailed: 'Analyse échouée',
        importFailed: 'Échec de l\'importation',
        lichessUserNotFound: 'Utilisateur Lichess non trouvé',
        ratingHistoryNotFound: 'Historique de classement non trouvé',
        lichessGamesNotFound: 'Parties non trouvées sur Lichess',
        dailyPuzzleFailed: 'Échec de récupération du puzzle quotidien',
        openingExplorerFailed: 'Échec de récupération de l\'explorateur d\'ouvertures',
        chesscomProfileNotFound: 'Profil Chess.com non trouvé',
        chesscomStatsNotFound: 'Statistiques Chess.com non trouvées',
        chesscomGamesNotFound: 'Parties non trouvées sur Chess.com',
      },
    },
    achievements: {
      title: {
        firstPuzzle: 'Premier puzzle résolu',
        tenPuzzles: 'Apprenti puzzle',
        hundredPuzzles: 'Maître puzzle',
        firstLesson: 'Premiers pas',
        firstCourse: 'Diplômé du cours',
        streak7: 'Guerrier de la semaine',
        streak30: 'Maître du mois',
        firstPost: 'Débutant social',
        firstComment: 'Conversationnel',
      },
      desc: {
        firstPuzzle: 'Vous avez résolu votre premier puzzle',
        tenPuzzles: 'Vous avez résolu 10 puzzles',
        hundredPuzzles: 'Vous avez résolu 100 puzzles',
        firstLesson: 'Vous avez terminé votre première leçon',
        firstCourse: 'Vous avez terminé votre premier cours',
        streak7: 'Série de 7 jours',
        streak30: 'Série de 30 jours',
        firstPost: 'Vous avez créé votre premier post',
        firstComment: 'Vous avez écrit votre premier commentaire',
      },
    },
    levels: {
      bronze: 'Bronze',
      silver: 'Argent',
      gold: 'Or',
      platinum: 'Platine',
      diamond: 'Diamant',
      master: 'Maître',
      grandmaster: 'Grand Maître',
    },
    plans: {
      standard: 'Standard',
      premium: 'Premium',
      vip: 'VIP',
    },
    notifications: {
      likedYourPost: '{name} a aimé votre publication',
      commentedOnYourPost: '{name} a commenté votre publication',
      followedYou: '{name} a commencé à vous suivre',
    },
    theme: {
      toggleTheme: 'Changer le thème',
    },
    leaderboard: {
      error: {
        fetchFailed: 'Échec de récupération du classement',
      },
    },
    progress: {
      validation: {
        lessonIdRequired: 'lessonId requis',
      },
    },
    lessons: {
      error: {
        notFound: 'Leçon non trouvée',
      },
      validation: {
        queryRequired: 'id, moduleId ou courseId requis',
      },
    },
    comments: {
      error: {
        fetchFailed: 'Échec de récupération des commentaires',
        addFailed: 'Échec d\'ajout du commentaire',
      },
    },
    users: {
      error: {
        cannotFollowSelf: 'Vous ne pouvez pas vous suivre vous-même',
        toggleFollowFailed: 'Échec du changement de suivi',
      },
    },
    upload: {
      error: {
        noFile: 'Aucun fichier fourni',
        failed: 'Échec du téléchargement du fichier',
      },
    },
    payments: {
      error: {
        invalidPlan: 'Plan invalide',
        checkoutFailed: 'Échec de création du paiement',
        noCustomer: 'Aucun client Stripe trouvé',
        portalFailed: 'Échec de création du portail',
        webhookError: 'Erreur webhook',
      },
    },
    xp: {
      error: {
        invalidAction: 'Action invalide',
      },
    },
    ai: {
      error: {
        fenRequired: 'FEN requis',
        unavailable: 'IA indisponible',
        allProvidersFailed: 'Tous les fournisseurs IA ont échoué',
      },
    },
    cron: {
      error: {
        fetchPuzzleFromLichess: 'Échec de récupération du puzzle depuis Lichess',
      },
    },
    posts: {
      error: {
        fetchFailed: 'Échec de récupération des publications',
        createFailed: 'Échec de création de la publication',
        updateFailed: 'Échec de mise à jour de la publication',
        deleteFailed: 'Échec de suppression de la publication',
        toggleLikeFailed: 'Échec du changement de like',
      },
      validation: {
        idAndContentRequired: 'ID et contenu requis',
      },
    },
    quizzes: {
      error: {
        notFound: 'Quiz non trouvé',
        maxAttempts: 'Nombre maximum de tentatives atteint',
        attemptNotFound: 'Tentative non trouvée',
        alreadySubmitted: 'Déjà soumis',
      },
    },
    adminValidation: {
      courseIdRequired: 'courseId requis',
      titleAndCourseIdRequired: 'Titre et courseId requis',
      idAndTitleRequired: 'ID et titre requis',
      moduleIdRequired: 'moduleId requis',
      titleModuleIdCourseIdRequired: 'Titre, moduleId et courseId requis',
      titleRequired: 'Titre requis',
      idAndContentRequired: 'ID et contenu requis',
    },
    authValidation: {
      nameTooShort: 'Nom trop court',
      invalidEmail: 'Entrez un email valide',
      passwordTooShort: 'Le mot de passe doit contenir au moins 8 caractères',
      emailExists: 'Un compte avec cet email existe déjà',
    },
    contactValidation: {
      fieldsRequired: 'Nom, email et message sont requis',
    },
    contactSuccess: {
      messageReceived: 'Message reçu. Nous vous répondrons bientôt.',
    },
    footerSocial: {
      youtube: 'YouTube',
      instagram: 'Instagram',
      discord: 'Discord',
      telegram: 'Telegram',
    },
    groupsValidation: {
      nameRequired: 'Nom requis',
    },
    tournamentsValidation: {
      nameRequired: 'Nom requis',
    },
    tournamentsError: {
      full: 'Tournoi complet',
    },
    puzzlesValidation: {
      fieldsRequired: 'puzzleId et solved requis',
    },
    puzzlesError: {
      notFound: 'Puzzle non trouvé',
      noneAvailable: 'Aucun puzzle disponible',
      recordFailed: 'Échec d\'enregistrement de la tentative',
    },
    coursesError: {
      notFound: 'Cours non trouvé',
    },
  },
  no: {
    common: {
      error: {
        unauthorized: 'Uautorisert',
        forbidden: 'Forbudt',
        notFound: 'Ikke funnet',
        failed: 'Mislyktes',
        internalServerError: 'Intern serverfeil',
        notAuthenticated: 'Ikke autentisert',
      },
      validation: {
        idRequired: 'ID kreves',
        contentRequired: 'Innhold kreves',
      },
    },
    chess: {
      undo: 'Angre',
      reset: 'Tilbakestill',
      engineAnalysis: 'Motoranalyse',
      evaluate: 'Evaluer',
      topLines: 'Topplinjer',
      score: 'Poeng',
      depth: 'Dybde',
      best: 'Beste',
      notAvailable: 'I/T',
      principalVariation: 'HV',
      engineError: 'Motorfeil',
      aiCoach: 'KI-trener',
      analyzing: 'Analyserer...',
      explainPosition: 'Forklar posisjon',
      aiCoachUnavailable: 'KI-trener utilgjengelig. Legg til en API-nøkkel.',
      engine: {
        initFailed: 'Kunne ikke initialisere motor',
        evalTimedOut: 'Motorevaluering tok for lang tid',
        notInitialized: 'Motor ikke initialisert',
      },
      validation: {
        pgnRequired: 'PGN kreves',
        invalidPgn: 'Ugyldig PGN',
        noMoves: 'Ingen trekk i PGN',
        usernameRequired: 'Brukernavn kreves',
      },
      error: {
        analysisFailed: 'Analyse mislyktes',
        importFailed: 'Import mislyktes',
        lichessUserNotFound: 'Lichess-bruker ikke funnet',
        ratingHistoryNotFound: 'Ratinghistorikk ikke funnet',
        lichessGamesNotFound: 'Partier ikke funnet på Lichess',
        dailyPuzzleFailed: 'Kunne ikke hente daglig oppgave',
        openingExplorerFailed: 'Kunne ikke hente åpningsdatabase',
        chesscomProfileNotFound: 'Chess.com-profil ikke funnet',
        chesscomStatsNotFound: 'Chess.com-statistikk ikke funnet',
        chesscomGamesNotFound: 'Partier ikke funnet på Chess.com',
      },
    },
    achievements: {
      title: {
        firstPuzzle: 'Første oppgave løst',
        tenPuzzles: 'Oppgave-lærling',
        hundredPuzzles: 'Oppgave-mester',
        firstLesson: 'Første steg',
        firstCourse: 'Kurs-utdannet',
        streak7: 'Ukeskriger',
        streak30: 'Månedsmester',
        firstPost: 'Sosial start',
        firstComment: 'Samtalepartner',
      },
      desc: {
        firstPuzzle: 'Løste din første oppgave',
        tenPuzzles: 'Løste 10 oppgaver',
        hundredPuzzles: 'Løste 100 oppgaver',
        firstLesson: 'Fullførte din første leksjon',
        firstCourse: 'Fullførte ditt første kurs',
        streak7: '7-dagers rekke',
        streak30: '30-dagers rekke',
        firstPost: 'Opprettet ditt første innlegg',
        firstComment: 'Skrev din første kommentar',
      },
    },
    levels: {
      bronze: 'Bronse',
      silver: 'Sølv',
      gold: 'Gull',
      platinum: 'Platina',
      diamond: 'Diamant',
      master: 'Mester',
      grandmaster: 'Stormester',
    },
    plans: {
      standard: 'Standard',
      premium: 'Premium',
      vip: 'VIP',
    },
    notifications: {
      likedYourPost: '{name} likte innlegget ditt',
      commentedOnYourPost: '{name} kommenterte på innlegget ditt',
      followedYou: '{name} begynte å følge deg',
    },
    theme: {
      toggleTheme: 'Bytt tema',
    },
    leaderboard: {
      error: {
        fetchFailed: 'Kunne ikke hente toppliste',
      },
    },
    progress: {
      validation: {
        lessonIdRequired: 'lessonId kreves',
      },
    },
    lessons: {
      error: {
        notFound: 'Leksjon ikke funnet',
      },
      validation: {
        queryRequired: 'id, moduleId eller courseId kreves',
      },
    },
    comments: {
      error: {
        fetchFailed: 'Kunne ikke hente kommentarer',
        addFailed: 'Kunne ikke legge til kommentar',
      },
    },
    users: {
      error: {
        cannotFollowSelf: 'Kan ikke følge deg selv',
        toggleFollowFailed: 'Kunne ikke endre følging',
      },
    },
    upload: {
      error: {
        noFile: 'Ingen fil oppgitt',
        failed: 'Opplasting mislyktes',
      },
    },
    payments: {
      error: {
        invalidPlan: 'Ugyldig plan',
        checkoutFailed: 'Kunne ikke opprette betaling',
        noCustomer: 'Ingen Stripe-kunde funnet',
        portalFailed: 'Kunne ikke opprette portal',
        webhookError: 'Webhook-feil',
      },
    },
    xp: {
      error: {
        invalidAction: 'Ugyldig handling',
      },
    },
    ai: {
      error: {
        fenRequired: 'FEN kreves',
        unavailable: 'KI utilgjengelig',
        allProvidersFailed: 'Alle KI-leverandører mislyktes',
      },
    },
    cron: {
      error: {
        fetchPuzzleFromLichess: 'Kunne ikke hente oppgave fra Lichess',
      },
    },
    posts: {
      error: {
        fetchFailed: 'Kunne ikke hente innlegg',
        createFailed: 'Kunne ikke opprette innlegg',
        updateFailed: 'Kunne ikke oppdatere innlegg',
        deleteFailed: 'Kunne ikke slette innlegg',
        toggleLikeFailed: 'Kunne ikke endre likerklikk',
      },
      validation: {
        idAndContentRequired: 'ID og innhold kreves',
      },
    },
    quizzes: {
      error: {
        notFound: 'Quiz ikke funnet',
        maxAttempts: 'Maks antall forsøk nådd',
        attemptNotFound: 'Forsøk ikke funnet',
        alreadySubmitted: 'Allerede sendt inn',
      },
    },
    adminValidation: {
      courseIdRequired: 'courseId kreves',
      titleAndCourseIdRequired: 'Tittel og courseId kreves',
      idAndTitleRequired: 'ID og tittel kreves',
      moduleIdRequired: 'moduleId kreves',
      titleModuleIdCourseIdRequired: 'Tittel, moduleId og courseId kreves',
      titleRequired: 'Tittel kreves',
      idAndContentRequired: 'ID og innhold kreves',
    },
    authValidation: {
      nameTooShort: 'Navn for kort',
      invalidEmail: 'Skriv inn en gyldig e-post',
      passwordTooShort: 'Passord må være minst 8 tegn',
      emailExists: 'En konto med denne e-posten finnes allerede',
    },
    contactValidation: {
      fieldsRequired: 'Navn, e-post og melding kreves',
    },
    contactSuccess: {
      messageReceived: 'Melding mottatt. Vi kontakter deg snart.',
    },
    footerSocial: {
      youtube: 'YouTube',
      instagram: 'Instagram',
      discord: 'Discord',
      telegram: 'Telegram',
    },
    groupsValidation: {
      nameRequired: 'Navn kreves',
    },
    tournamentsValidation: {
      nameRequired: 'Navn kreves',
    },
    tournamentsError: {
      full: 'Turnering full',
    },
    puzzlesValidation: {
      fieldsRequired: 'puzzleId og solved kreves',
    },
    puzzlesError: {
      notFound: 'Oppgave ikke funnet',
      noneAvailable: 'Ingen oppgaver tilgjengelig',
      recordFailed: 'Kunne ikke registrere forsøk',
    },
    coursesError: {
      notFound: 'Kurs ikke funnet',
    },
  },
};

const locales = ['fa', 'ru', 'it', 'de', 'fr', 'no'];

// Sections that should be nested objects but are flat strings
const nestedSections = [
  'common', 'chess', 'achievements', 'levels', 'plans', 'notifications',
  'theme', 'leaderboard', 'progress', 'lessons', 'comments', 'users',
  'upload', 'payments', 'xp', 'ai', 'cron', 'posts', 'quizzes',
];

function fixLocale(locale: string) {
  const localePath = path.join(messagesDir, `${locale}.json`);
  let raw = fs.readFileSync(localePath, 'utf-8');
  // Remove BOM if present
  raw = raw.replace(/^\uFEFF/, '');
  // Remove trailing literal \n after closing brace (malformed JSON in some files)
  raw = raw.replace(/\}\s*\\n\s*$/g, '}');
  // Trim trailing whitespace
  raw = raw.trimEnd();
  const localeData = JSON.parse(raw);
  const localeTrans = translations[locale];

  if (!localeTrans) {
    console.log(`  ⚠ No translations found for ${locale}`);
    return;
  }

  let fixedCount = 0;

  // Fix top-level flat sections
  for (const section of nestedSections) {
    if (isString(localeData[section]) && isObject(en[section]) && isObject(localeTrans[section])) {
      localeData[section] = localeTrans[section];
      fixedCount++;
    }
  }

  // Fix auth.validation (flat string → nested object)
  if (isObject(localeData.auth) && isString(localeData.auth['validation']) && localeTrans.authValidation) {
    localeData.auth.validation = localeTrans.authValidation;
    fixedCount++;
  }

  // Fix contact.validation and contact.success
  if (isObject(localeData.contact)) {
    if (isString(localeData.contact['validation']) && localeTrans.contactValidation) {
      localeData.contact.validation = localeTrans.contactValidation;
      fixedCount++;
    }
    if (isString(localeData.contact['success']) && localeTrans.contactSuccess) {
      localeData.contact.success = localeTrans.contactSuccess;
      fixedCount++;
    }
  }

  // Fix footer.social
  if (isObject(localeData.footer) && isString(localeData.footer['social']) && localeTrans.footerSocial) {
    localeData.footer.social = localeTrans.footerSocial;
    fixedCount++;
  }

  // Fix groups.validation
  if (isObject(localeData.groups) && isString(localeData.groups['validation']) && localeTrans.groupsValidation) {
    localeData.groups.validation = localeTrans.groupsValidation;
    fixedCount++;
  }

  // Fix tournaments.validation and tournaments.error
  if (isObject(localeData.tournaments)) {
    if (isString(localeData.tournaments['validation']) && localeTrans.tournamentsValidation) {
      localeData.tournaments.validation = localeTrans.tournamentsValidation;
      fixedCount++;
    }
    if (isString(localeData.tournaments['error']) && localeTrans.tournamentsError) {
      localeData.tournaments.error = localeTrans.tournamentsError;
      fixedCount++;
    }
  }

  // Fix puzzles.validation and puzzles.error
  if (isObject(localeData.puzzles)) {
    if (isString(localeData.puzzles['validation']) && localeTrans.puzzlesValidation) {
      localeData.puzzles.validation = localeTrans.puzzlesValidation;
      fixedCount++;
    }
    if (isString(localeData.puzzles['error']) && localeTrans.puzzlesError) {
      localeData.puzzles.error = localeTrans.puzzlesError;
      fixedCount++;
    }
  }

  // Fix admin.validation
  if (isObject(localeData.admin) && isString(localeData.admin['validation']) && localeTrans.adminValidation) {
    localeData.admin.validation = localeTrans.adminValidation;
    fixedCount++;
  }

  // Fix courses.error
  if (isObject(localeData.courses) && isString(localeData.courses['error']) && localeTrans.coursesError) {
    localeData.courses.error = localeTrans.coursesError;
    fixedCount++;
  }

  fs.writeFileSync(localePath, JSON.stringify(localeData, null, 2) + '\n');
  console.log(`  ✅ ${locale}: ${fixedCount} sections fixed`);
}

// Also fix specific known errors
function fixKnownErrors() {
  const faPath = path.join(messagesDir, 'fa.json');
  const fa = JSON.parse(fs.readFileSync(faPath, 'utf-8').trim());
  // Fix Chinese in Persian: "连胜" → "رکورد متوالی"
  if (fa.puzzles?.streak === '连胜') {
    fa.puzzles.streak = 'رکورد متوالی';
    console.log('  🐛 fa: Fixed Chinese streak → Persian');
  }
  fs.writeFileSync(faPath, JSON.stringify(fa, null, 2) + '\n');

  const ruPath = path.join(messagesDir, 'ru.json');
  const ru = JSON.parse(fs.readFileSync(ruPath, 'utf-8').trim());
  // Fix English in Russian dashboard strings
  if (ru.dashboard) {
    if (ru.dashboard.importGames === 'Import partiy') {
      ru.dashboard.importGames = 'Импорт партий';
      console.log('  🐛 ru: Fixed importGames → Импорт партий');
    }
    if (ru.dashboard.importing === 'Import...') {
      ru.dashboard.importing = 'Импорт...';
      console.log('  🐛 ru: Fixed importing → Импорт...');
    }
    if (ru.dashboard.noGamesFound === 'Partii ne naydeny.') {
      ru.dashboard.noGamesFound = 'Партии не найдены.';
      console.log('  🐛 ru: Fixed noGamesFound → Партии не найдены.');
    }
  }
  fs.writeFileSync(ruPath, JSON.stringify(ru, null, 2) + '\n');

  const dePath = path.join(messagesDir, 'de.json');
  const de = JSON.parse(fs.readFileSync(dePath, 'utf-8').trim());
  if (de.dashboard?.chooseFile === '.pgn-Datei waehlen') {
    de.dashboard.chooseFile = '.pgn-Datei wählen';
    console.log('  🐛 de: Fixed waehlen → wählen');
  }
  fs.writeFileSync(dePath, JSON.stringify(de, null, 2) + '\n');

  const frPath = path.join(messagesDir, 'fr.json');
  const fr = JSON.parse(fs.readFileSync(frPath, 'utf-8').trim());
  if (fr.dashboard) {
    if (fr.dashboard.noGamesFound === 'Aucune partie trouvee.') {
      fr.dashboard.noGamesFound = 'Aucune partie trouvée.';
      console.log('  🐛 fr: Fixed trouvee → trouvée');
    }
    if (fr.dashboard.uploadPgnFile === 'Telecharger un fichier PGN') {
      fr.dashboard.uploadPgnFile = 'Télécharger un fichier PGN';
      console.log('  🐛 fr: Fixed Telecharger → Télécharger');
    }
  }
  fs.writeFileSync(frPath, JSON.stringify(fr, null, 2) + '\n');
}

console.log('Fixing i18n translation files...\n');

for (const locale of locales) {
  fixLocale(locale);
}

console.log('');
fixKnownErrors();

console.log('\nDone! All 6 locales fixed.');
