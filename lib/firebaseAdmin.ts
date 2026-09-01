import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = {
  type: 'service_account',
  project_id: 'coffeebase-e51e6',
  private_key_id: '0f206ece7f486a471fba22dd1f0ff770ef697944',
  private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDotKhphjKfX1a6\nkyOc3NtoBB2CExn/ZpkF5r+3LkXdHCcX1O7NYAxnkTK5/BRl7KRSr4ECfJP+hGK1\nm4mg01qc4Sf6J+nHRsZx0PUNaEHzANuZasUKv/svjzsY3FUQQpp1mPwzODlluzcs\nRkOSb71dg8I3ROtxU6F9MwTVvswbm7zhlnYnUNQKYacp99sRRSrUXwRqEh5B6Ugx\njVIpgL9mAB3E5eRuXURIeyxyTBYboya11IU3I6OtZLwHrgFbZ2HG2Qh8DmF6a3ju\nQXatZr7NDaPJ8mUeJ81ev2izeidWikmuak7bTrLOvwrYzh0ZqvG8GW8XfOpaeslO\nfivYmOlxAgMBAAECggEAAN1aS9/LorNzGinbzJ4DS/Maeq4F1T/wmefXRlpQjIqp\no1Ljex+0yG+tBetgWfhCTU6FsdLtiQxeTyBw6SHBvhCvicUwQN+s4M4SnjpV1KBD\niGWEG80slnmYUCJVy35xk0hJaauJjgg2/s9ge+2U7utOYn6Wv+KQcDhXI5oCjBX+\nRUEsKmbbmH7F4RjEdsN9mrd8Ye6QjeU+NXZOOyW602XClIum/WV2kPv9lFp+Gt7N\nn7uWgaafxH3A1BoUk5CoUFrjc3GHVX6F8rosqddKIc1Ewy2IiQY0xS5J421lDxED\nNVRDOG8OYcyPhhVG8PKW12MYoaBSyXqxwsj1qAw4xQKBgQD5ZBCSnPrFFpT+i4JL\nNrNIldiUIMoQVtQI+iU9plWz3YIVs5gQbdPwp0MuAa4afM6kXMOSHl2WgaPdfzEs\nUpkpzOpNd3ZBsUhGSJebkDcses2jxEfyIczvvf+S29e+kpcmSjMyr+QupoPZ9rjS\nSTmbOv4W2psxdggazTKtc4e7HwKBgQDu32V1VXpBQKpame9H1sXhXYxIDINn38Mb\nogkY5u4ZdNVXMUnfCM0CAETjMhh/+DmK4q4txu/+LoKJvhuzy+LcWiqllVxn0aNC\nJyQ73/21o1j3xfpoP068obVuGE4vz+tXHYZ1hD5BidmA8bN/j+hahiiSQm0MB77I\nGksuCi9ZbwKBgBFJpXh0V1HYOeXXR+Xs2cq7UHMcPsWZL0OcC37Vi/VW8pCMjYr+\nAgYZoieLSEVfx3dPUuNLJZOsUu6kxYTcCPAD224ZTOJK5sawe4n2Gk0ECkNC9PXM\n8Abiddf5U2BLixzFYf0ugjPVqSgv2SoCl3KySTDOYJmyI+evt8acTpljAoGAJDnm\n9iNvdgPrke/0dO2iduosAyU6rH8n5MHvJUKoa13nmOCVtmhsRthpmhcX1hh8CY8V\nIUYhUWgWTfNx2hOapRZbj18Wc3w8iSTMfvQaUvih3nm83yByvXK8xCSVfvTGWSDW\nKm5SzresL7z4HulhMJFWB9BhH0jxawFp02KiCasCgYEAqF5COOZ95tOqcxAYHpy4\nK5ab29kFz8aK5qrVReCUN0vt1/L5Ab/jGsF3rk7bb5aculGDOwUgomyIZxXvFu25\noKf5ObRBTEYk3IP9J893VkjhpFvVJ2HmfHFASmiiGg/0STAib59pVr6noy0UZgzE\nOG/GDD4N8OacQwoI+5DVOWw=\n-----END PRIVATE KEY-----\n',
  client_email: 'firebase-adminsdk-fbsvc@coffeebase-e51e6.iam.gserviceaccount.com',
  client_id: '105216410605666452667',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40coffeebase-e51e6.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
};

const adminApp = !getApps().length
  ? initializeApp({
      credential: cert(serviceAccount as any),
    })
  : getApps()[0];

export const adminAuth = getAuth(adminApp);
