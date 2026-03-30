// Интерфейс для запроса с payload-данными пользователя
// Данные о пользователе хранятся и извлекаются из токена,
// через JWTAuthGuard на основе стратегии JWTAccessStrategy
export type RequestWithUserPayloadType<T> = {
  user?: T;
}
