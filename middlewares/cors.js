const allowedCors = [
  'https://domainname.evgenia2405.nomoredomainsclub.ru',
  'http://domainname.evgenia2405.nomoredomainsclub.ru',
  'http://localhost:3000',
];

function cors(req, res, next) {
  const { origin } = req.headers;
  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную

  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE'; // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    // разрешаем кросс-доменные запросы с этими заголовками
    res.header('Access-Control-Allow-Headers', requestHeaders);
    // завершаем обработку запроса и возвращаем результат клиенту
    return res.end();
  }
  next();
  return null;
}

module.exports = { cors };
