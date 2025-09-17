import { createPinia } from "pinia";

export function setupPinia(app: any) {
  app.use(createPinia());
}
